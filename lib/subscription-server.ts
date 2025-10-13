import { UserProgress, SUBSCRIPTION_PLANS } from '@/types/subscription';
import { clerkClient } from '@clerk/nextjs/server';
import { auth } from '@clerk/nextjs/server';

export class SubscriptionManagerServer {
  static async getUserProgress(clerkUserId: string): Promise<UserProgress> {
    try {
      const client = await clerkClient();
      const user = await client.users.getUser(clerkUserId);
      
      // Get progress from user's public metadata
      const progress = user.publicMetadata?.progress as UserProgress;
      
      // Count actual active projects with sandbox URLs for accurate tracking
      const projects = (user.privateMetadata?.projects as any[]) || [];
      const activeProjects = projects.filter(p => p.url && p.isActive);
      
      if (progress) {
        // Update the progress with actual project count
        const updatedProgress = {
          ...progress,
          totalAppsGenerated: Math.max(progress.totalAppsGenerated, activeProjects.length),
          currentPlanAppsGenerated: Math.max(progress.currentPlanAppsGenerated, activeProjects.length)
        };
        
        // Save updated progress if it changed
        if (updatedProgress.totalAppsGenerated !== progress.totalAppsGenerated || 
            updatedProgress.currentPlanAppsGenerated !== progress.currentPlanAppsGenerated) {
          await client.users.updateUserMetadata(clerkUserId, {
            publicMetadata: {
              progress: updatedProgress,
            },
          });
        }
        
        return updatedProgress;
      }
      
      // Initialize free plan for new users
      const initialProgress: UserProgress = {
        userId: clerkUserId,
        totalAppsGenerated: activeProjects.length,
        currentPlanAppsGenerated: activeProjects.length,
        subscriptionStatus: 'free',
      };
      
      // Save initial progress to Clerk
      await client.users.updateUserMetadata(clerkUserId, {
        publicMetadata: {
          progress: initialProgress,
        },
      });
      
      return initialProgress;
    } catch (error) {
      console.error('Error getting user progress:', error);
      throw error;
    }
  }

  static async saveUserProgress(progress: UserProgress): Promise<void> {
    try {
      const client = await clerkClient();
      await client.users.updateUserMetadata(progress.userId, {
        publicMetadata: {
          progress,
        },
      });
    } catch (error) {
      console.error('Error saving user progress:', error);
      throw error;
    }
  }

  static async incrementAppGeneration(clerkUserId: string, appName: string, prompt: string): Promise<UserProgress> {
    try {
      const progress = await this.getUserProgress(clerkUserId);
      
      const updatedProgress: UserProgress = {
        ...progress,
        totalAppsGenerated: progress.totalAppsGenerated + 1,
        currentPlanAppsGenerated: progress.currentPlanAppsGenerated + 1,
        lastAppGeneratedAt: new Date(),
      };
      
      await this.saveUserProgress(updatedProgress);
      
      // Also save the generated app details in user's private metadata
      const client = await clerkClient();
      const user = await client.users.getUser(clerkUserId);
      const generatedApps = (user.privateMetadata?.generatedApps as any[]) || [];
      
      generatedApps.push({
        id: `app_${Date.now()}`,
        name: appName,
        prompt,
        planUsed: progress.subscriptionStatus,
        createdAt: new Date().toISOString(),
      });
      
      await client.users.updateUserMetadata(clerkUserId, {
        privateMetadata: {
          ...user.privateMetadata,
          generatedApps,
        },
      });
      
      return updatedProgress;
    } catch (error) {
      console.error('Error incrementing app generation:', error);
      throw error;
    }
  }

  static async canGenerateApp(clerkUserId: string): Promise<{ canGenerate: boolean; reason?: string }> {
    try {
      const { has } = await auth();
      const progress = await this.getUserProgress(clerkUserId);
      
      // Check if user has any active plan - try different plan name variations
      const hasPremiumPlan = has({ plan: 'premium' }) || has({ plan: 'Premium Plan' }) || has({ plan: 'Premium' });
      const hasProPlan = has({ plan: 'pro' }) || has({ plan: 'Pro Plan' }) || has({ plan: 'Pro' }) || has({ plan: 'standard' }) || has({ plan: 'Standard' });
      
      // Determine current plan based on Clerk subscription
      let currentPlan = SUBSCRIPTION_PLANS.find(plan => plan.id === 'free');
      let newStatus: 'free' | 'pro' | 'premium' = 'free';
      
      if (hasPremiumPlan) {
        currentPlan = SUBSCRIPTION_PLANS.find(plan => plan.id === 'premium');
        newStatus = 'premium';
      } else if (hasProPlan) {
        currentPlan = SUBSCRIPTION_PLANS.find(plan => plan.id === 'pro');
        newStatus = 'pro';
      }
      
      if (!currentPlan) {
        return { canGenerate: false, reason: 'Invalid subscription plan' };
      }
      
      // Update user's subscription status if it doesn't match
      if (progress.subscriptionStatus !== newStatus) {
        progress.subscriptionStatus = newStatus;
        // Reset counter when upgrading plans
        if (newStatus !== 'free') {
          progress.currentPlanAppsGenerated = 0;
        }
        await this.saveUserProgress(progress);
      }
      
      // Count apps based on sandbox URLs for accurate tracking
      const client = await clerkClient();
      const user = await client.users.getUser(clerkUserId);
      const projects = (user.privateMetadata?.projects as any[]) || [];
      const activeProjects = projects.filter(p => p.url && p.isActive);
      
      // For free plan, enforce strict limit based on actual sandbox count
      if (currentPlan.id === 'free' && activeProjects.length >= currentPlan.appLimit!) {
        return { canGenerate: false, reason: 'Free plan allows only 1 app. Please upgrade to create more apps!' };
      }
      
      // Check app limits for other plans
      if (currentPlan.appLimit !== null && progress.currentPlanAppsGenerated >= currentPlan.appLimit) {
        if (progress.subscriptionStatus === 'pro') {
          return { canGenerate: false, reason: 'Monthly limit reached. Upgrade to Premium for unlimited apps or wait for next billing cycle.' };
        }
      }
      
      return { canGenerate: true };
    } catch (error) {
      console.error('Error checking app generation limit:', error);
      return { canGenerate: false, reason: 'Error checking subscription status' };
    }
  }

  static async resetMonthlyCounter(clerkUserId: string): Promise<void> {
    try {
      const progress = await this.getUserProgress(clerkUserId);
      const updatedProgress: UserProgress = {
        ...progress,
        currentPlanAppsGenerated: 0,
      };
      
      await this.saveUserProgress(updatedProgress);
    } catch (error) {
      console.error('Error resetting monthly counter:', error);
      throw error;
    }
  }

  static async updateSubscriptionStatus(clerkUserId: string): Promise<UserProgress> {
    try {
      const { has } = await auth();
      const progress = await this.getUserProgress(clerkUserId);
      
      let newStatus: 'free' | 'pro' | 'premium' | 'expired' = 'free';
      
      if (has({ plan: 'premium' })) {
        newStatus = 'premium';
      } else if (has({ plan: 'pro' })) {
        newStatus = 'pro';
      }
      
      const updatedProgress: UserProgress = {
        ...progress,
        subscriptionStatus: newStatus,
      };
      
      await this.saveUserProgress(updatedProgress);
      return updatedProgress;
    } catch (error) {
      console.error('Error updating subscription status:', error);
      throw error;
    }
  }
}