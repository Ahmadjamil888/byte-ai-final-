"use client";

import { useUser, useAuth } from '@clerk/nextjs';
import { useEffect, useState } from 'react';

export default function AuthDebug() {
  const { user, isLoaded, isSignedIn } = useUser();
  const { userId, sessionId } = useAuth();
  const [apiTest, setApiTest] = useState<string>('Not tested');

  useEffect(() => {
    if (isLoaded && user) {
      testApi();
    }
  }, [isLoaded, user]);

  const testApi = async () => {
    try {
      const response = await fetch('/api/sync-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        setApiTest('✅ Success');
      } else {
        setApiTest(`❌ Failed: ${response.status}`);
      }
    } catch (error) {
      setApiTest(`❌ Error: ${error}`);
    }
  };

  if (!isLoaded) {
    return <div className="text-yellow-400">Loading auth...</div>;
  }

  return (
    <div className="bg-gray-800 p-4 rounded-lg text-sm">
      <h3 className="text-white font-bold mb-2">Auth Debug</h3>
      <div className="text-gray-300 space-y-1">
        <p>Is Loaded: {isLoaded ? '✅' : '❌'}</p>
        <p>Is Signed In: {isSignedIn ? '✅' : '❌'}</p>
        <p>User ID: {userId || 'None'}</p>
        <p>Session ID: {sessionId || 'None'}</p>
        <p>User Email: {user?.emailAddresses[0]?.emailAddress || 'None'}</p>
        <p>API Test: {apiTest}</p>
        <button 
          onClick={testApi}
          className="mt-2 bg-blue-500 text-white px-3 py-1 rounded text-xs"
        >
          Test API
        </button>
      </div>
    </div>
  );
}