"use client";

import { useEffect } from 'react';
import { useUser } from '@clerk/nextjs';

export default function UserSync() {
  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (isLoaded && user) {
      // Add a small delay to ensure authentication is fully established
      const timer = setTimeout(() => {
        syncUserData();
      }, 200);
      
      return () => clearTimeout(timer);
    }
  }, [isLoaded, user]);

  const syncUserData = async () => {
    if (!user) return;

    try {
      // Use dedicated sync endpoint that handles user creation
      const response = await fetch('/api/sync-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('User synced successfully:', data.progress);
      } else if (response.status === 401) {
        console.warn('User not authenticated yet, will retry on next render');
      } else {
        const errorData = await response.json();
        console.error('Failed to sync user data:', errorData.error);
      }
    } catch (error) {
      console.error('Error syncing user data:', error);
    }
  };

  // This component doesn't render anything, it just handles user sync
  return null;
}