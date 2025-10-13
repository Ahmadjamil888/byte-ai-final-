import { UserProgress, SUBSCRIPTION_PLANS } from '@/types/subscription';

export class SubscriptionManager {
  static getTrialDaysRemaining(trialStartDate: Date): number {
    const now = new Date();
    const trialEnd = new Date(trialStartDate);
    trialEnd.setDate(trialEnd.getDate() + 7);
    
    const diffTime = trialEnd.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return Math.max(0, diffDays);
  }

  static getCurrentPlan(subscriptionStatus: string) {
    return SUBSCRIPTION_PLANS.find(plan => plan.id === subscriptionStatus) || SUBSCRIPTION_PLANS[0];
  }

  static isTrialExpired(progress: UserProgress): boolean {
    if (progress.subscriptionStatus !== 'trial' || !progress.trialStartDate) {
      return false;
    }
    
    return this.getTrialDaysRemaining(progress.trialStartDate) <= 0;
  }

  static canGenerateBasedOnLimits(progress: UserProgress): { canGenerate: boolean; reason?: string } {
    const currentPlan = this.getCurrentPlan(progress.subscriptionStatus);
    
    // Check trial expiry
    if (this.isTrialExpired(progress)) {
      return { canGenerate: false, reason: 'Trial expired. Please upgrade to continue.' };
    }
    
    // Check app limits
    if (currentPlan.appLimit !== null && progress.currentPlanAppsGenerated >= currentPlan.appLimit) {
      if (progress.subscriptionStatus === 'trial') {
        return { canGenerate: false, reason: 'Trial limit reached. Please upgrade to continue.' };
      } else {
        return { canGenerate: false, reason: 'Monthly limit reached. Upgrade to a higher plan or wait for next billing cycle.' };
      }
    }
    
    return { canGenerate: true };
  }
}