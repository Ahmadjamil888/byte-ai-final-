#!/usr/bin/env node

/**
 * Test script to verify Firecrawl API configuration
 * Run with: node test-firecrawl.js
 */

import { config } from 'dotenv';
config({ path: '.env.local' });

async function testFirecrawlAPI() {
  console.log('🧪 Testing Firecrawl API...');
  
  const apiKey = process.env.FIRECRAWL_API_KEY;
  
  if (!apiKey) {
    console.error('❌ FIRECRAWL_API_KEY not found in environment');
    return false;
  }
  
  console.log('🔑 API Key found:', apiKey.substring(0, 10) + '...');
  
  try {
    // Test with a simple search query
    const response = await fetch('https://api.firecrawl.dev/v1/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        query: 'react components',
        limit: 3,
        scrapeOptions: {
          formats: ['markdown'],
          onlyMainContent: true,
        },
      }),
    });
    
    console.log('📡 Response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API Error:', errorText);
      return false;
    }
    
    const data = await response.json();
    console.log('✅ API Response received');
    console.log('📊 Results count:', data.data?.length || 0);
    
    if (data.data && data.data.length > 0) {
      console.log('📄 Sample result:', {
        url: data.data[0].url,
        title: data.data[0].title?.substring(0, 50) + '...'
      });
    }
    
    return true;
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    return false;
  }
}

async function main() {
  console.log('🔧 Testing Firecrawl Configuration...\n');
  
  const success = await testFirecrawlAPI();
  
  if (success) {
    console.log('\n🎉 Firecrawl API is working correctly!');
  } else {
    console.log('\n⚠️  Firecrawl API test failed. The app will use fallback search results.');
    console.log('💡 This is normal - the search feature will still work with predefined results.');
  }
}

main().catch(console.error);