import { NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs/server';
import { SandboxFactory } from '@/lib/sandbox/factory';
// SandboxProvider type is used through SandboxFactory
import type { SandboxState } from '@/types/sandbox';
import { sandboxManager } from '@/lib/sandbox/sandbox-manager';
import { SubscriptionManagerServer } from '@/lib/subscription-server';

// Store active sandbox globally
declare global {
  var activeSandboxProvider: any;
  var sandboxData: any;
  var existingFiles: Set<string>;
  var sandboxState: SandboxState;
}

export async function POST() {
  try {
    console.log('[create-ai-sandbox-v2] Creating sandbox...');
    
    // Check authentication
    const { userId } = await auth();
    if (!userId) {
      console.log('[create-ai-sandbox-v2] No userId found');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    console.log('[create-ai-sandbox-v2] User authenticated:', userId);

    // Check if user can generate apps based on their subscription
    console.log('[create-ai-sandbox-v2] Checking generation limits...');
    const canGenerate = await SubscriptionManagerServer.canGenerateApp(userId);
    console.log('[create-ai-sandbox-v2] Can generate:', canGenerate);
    
    if (!canGenerate.canGenerate) {
      console.log('[create-ai-sandbox-v2] Generation limit reached:', canGenerate.reason);
      return NextResponse.json({ 
        error: canGenerate.reason,
        limitReached: true 
      }, { status: 403 });
    }

    // Clean up all existing sandboxes
    console.log('[create-ai-sandbox-v2] Cleaning up existing sandboxes...');
    await sandboxManager.terminateAll();
    
    // Also clean up legacy global state
    if (global.activeSandboxProvider) {
      try {
        await global.activeSandboxProvider.terminate();
      } catch (e) {
        console.error('Failed to terminate legacy global sandbox:', e);
      }
      global.activeSandboxProvider = null;
    }
    
    // Clear existing files tracking
    if (global.existingFiles) {
      global.existingFiles.clear();
    } else {
      global.existingFiles = new Set<string>();
    }

    // Create new sandbox using factory
    console.log('[create-ai-sandbox-v2] Creating sandbox provider...');
    const provider = SandboxFactory.create();
    console.log('[create-ai-sandbox-v2] Provider created, creating sandbox...');
    
    const sandboxInfo = await provider.createSandbox();
    console.log('[create-ai-sandbox-v2] Sandbox created:', sandboxInfo);
    
    console.log('[create-ai-sandbox-v2] Setting up Vite React app...');
    await provider.setupViteApp();
    console.log('[create-ai-sandbox-v2] Vite app setup complete');
    
    // Register with sandbox manager
    sandboxManager.registerSandbox(sandboxInfo.sandboxId, provider);
    
    // Also store in legacy global state for backward compatibility
    global.activeSandboxProvider = provider;
    global.sandboxData = {
      sandboxId: sandboxInfo.sandboxId,
      url: sandboxInfo.url
    };
    
    // Initialize sandbox state
    global.sandboxState = {
      fileCache: {
        files: {},
        lastSync: Date.now(),
        sandboxId: sandboxInfo.sandboxId
      },
      sandbox: provider, // Store the provider instead of raw sandbox
      sandboxData: {
        sandboxId: sandboxInfo.sandboxId,
        url: sandboxInfo.url
      }
    };
    
    console.log('[create-ai-sandbox-v2] Sandbox ready at:', sandboxInfo.url);
    
    // Record the app generation and create project entry
    try {
      await SubscriptionManagerServer.incrementAppGeneration(
        userId, 
        `App-${sandboxInfo.sandboxId}`, 
        'New app generation'
      );
      
      // Create project entry
      const client = await clerkClient();
      const user = await client.users.getUser(userId);
      const projects = (user.privateMetadata?.projects as any[]) || [];
      
      // Get current subscription status for accurate tracking
      const progress = await SubscriptionManagerServer.getUserProgress(userId);
      
      const newProject = {
        id: `project_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
        name: `App ${projects.length + 1}`,
        description: 'Generated app',
        sandboxId: sandboxInfo.sandboxId,
        url: sandboxInfo.url,
        createdAt: new Date(),
        updatedAt: new Date(),
        planUsed: progress.subscriptionStatus,
        isActive: true
      };
      
      projects.push(newProject);
      
      await client.users.updateUserMetadata(userId, {
        privateMetadata: {
          ...user.privateMetadata,
          projects
        }
      });
      
      console.log('[create-ai-sandbox-v2] App generation and project recorded');
    } catch (error) {
      console.error('[create-ai-sandbox-v2] Failed to record app generation:', error);
      // Don't fail the sandbox creation if recording fails
    }
    
    return NextResponse.json({
      success: true,
      sandboxId: sandboxInfo.sandboxId,
      url: sandboxInfo.url,
      provider: sandboxInfo.provider,
      message: 'Sandbox created and Vite React app initialized'
    });

  } catch (error) {
    console.error('[create-ai-sandbox-v2] Error:', error);
    
    // Clean up on error
    await sandboxManager.terminateAll();
    if (global.activeSandboxProvider) {
      try {
        await global.activeSandboxProvider.terminate();
      } catch (e) {
        console.error('Failed to terminate sandbox on error:', e);
      }
      global.activeSandboxProvider = null;
    }
    
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to create sandbox',
        details: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}