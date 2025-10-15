"use client";

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { SubscriptionManager } from '@/lib/subscription';
import { UserProgress } from '@/types/subscription';
import { toast } from 'sonner';

// Use canonical UserProgress type from '@/types/subscription'

interface GenerationCheck {
  canGenerate: boolean;
  reason?: string;
  progress: UserProgress;
}

export function useSubscription() {
  const { user, isLoaded } = useUser();
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isLoaded && user) {
      // Add a small delay to ensure authentication is fully established
      const timer = setTimeout(() => {
        checkGenerationLimit();
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [isLoaded, user]);

  const checkGenerationLimit = async (): Promise<GenerationCheck | null> => {
    if (!user) return null;

    try {
      const response = await fetch('/api/check-generation-limit', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data: GenerationCheck = await response.json();
        setProgress(data.progress);
        return data;
      } else if (response.status === 401) {
        console.warn('User not authenticated, retrying...');
        // Don't show error for auth issues, just return null
        return null;
      } else {
        const errorData = await response.json();
        console.error('API error:', errorData);
        toast.error('Failed to check subscription status');
      }
    } catch (error) {
      console.error('Error checking generation limit:', error);
      toast.error('Failed to check subscription status');
    }
    return null;
  };

  const recordAppGeneration = async (appName: string, prompt: string): Promise<boolean> => {
    if (!user) return false;

    setLoading(true);
    try {
      const response = await fetch('/api/record-app-generation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ appName, prompt }),
      });

      if (response.ok) {
        const data = await response.json();
        setProgress(data.progress);
        return true;
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to record app generation');
        return false;
      }
    } catch (error) {
      console.error('Error recording app generation:', error);
      toast.error('Failed to record app generation');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const canGenerateApp = async (): Promise<{ canGenerate: boolean; reason?: string }> => {
    const result = await checkGenerationLimit();
    if (!result) {
      return { canGenerate: false, reason: 'Failed to check subscription status' };
    }
    return { canGenerate: result.canGenerate, reason: result.reason };
  };

  return {
    progress,
    loading,
    checkGenerationLimit,
    recordAppGeneration,
    canGenerateApp,
    refreshProgress: checkGenerationLimit,
  };
}