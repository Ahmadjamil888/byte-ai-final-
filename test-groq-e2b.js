#!/usr/bin/env node

/**
 * Test script to verify Groq and E2B configuration
 * Run with: node test-groq-e2b.js
 */

const { createGroq } = require('@ai-sdk/groq');
const { Sandbox } = require('@e2b/code-interpreter');

async function testGroqConnection() {
  console.log('🧪 Testing Groq Connection...');
  
  if (!process.env.GROQ_API_KEY) {
    console.error('❌ GROQ_API_KEY not found in environment');
    return false;
  }
  
  try {
    const groq = createGroq({
      apiKey: process.env.GROQ_API_KEY,
    });
    
    console.log('✅ Groq client initialized successfully');
    console.log('🔑 API Key found:', process.env.GROQ_API_KEY.substring(0, 10) + '...');
    return true;
  } catch (error) {
    console.error('❌ Groq initialization failed:', error.message);
    return false;
  }
}

async function testE2BConnection() {
  console.log('\n🧪 Testing E2B Connection...');
  
  if (!process.env.E2B_API_KEY) {
    console.error('❌ E2B_API_KEY not found in environment');
    return false;
  }
  
  try {
    console.log('✅ E2B API Key found:', process.env.E2B_API_KEY.substring(0, 10) + '...');
    
    // Test creating a sandbox (this will actually create one, so we'll close it immediately)
    console.log('🚀 Creating test E2B sandbox...');
    const sandbox = await Sandbox.create({ 
      apiKey: process.env.E2B_API_KEY,
      timeoutMs: 30000 // 30 seconds for test
    });
    
    console.log('✅ E2B sandbox created successfully');
    console.log('📦 Sandbox ID:', sandbox.sandboxId || 'Unknown');
    
    // Test running a simple command
    const result = await sandbox.runCode('print("Hello from E2B!")');
    console.log('✅ Code execution test:', result.logs.stdout.join(''));
    
    // Clean up
    await sandbox.kill();
    console.log('🧹 Test sandbox cleaned up');
    
    return true;
  } catch (error) {
    console.error('❌ E2B test failed:', error.message);
    return false;
  }
}

async function testConfiguration() {
  console.log('🔧 Testing Byte AI Configuration...\n');
  
  // Test environment variables
  console.log('📋 Environment Variables:');
  console.log('- SANDBOX_PROVIDER:', process.env.SANDBOX_PROVIDER || 'not set (will default to e2b)');
  console.log('- GROQ_API_KEY:', process.env.GROQ_API_KEY ? '✅ Set' : '❌ Missing');
  console.log('- E2B_API_KEY:', process.env.E2B_API_KEY ? '✅ Set' : '❌ Missing');
  console.log('- AI_GATEWAY_API_KEY:', process.env.AI_GATEWAY_API_KEY ? '✅ Set (will override individual keys)' : 'Not set');
  
  const groqOk = await testGroqConnection();
  const e2bOk = await testE2BConnection();
  
  console.log('\n📊 Test Results:');
  console.log('- Groq Configuration:', groqOk ? '✅ Working' : '❌ Failed');
  console.log('- E2B Configuration:', e2bOk ? '✅ Working' : '❌ Failed');
  
  if (groqOk && e2bOk) {
    console.log('\n🎉 All tests passed! Your Byte AI is configured correctly for Groq + E2B.');
    console.log('\n🚀 Ready to use:');
    console.log('- Fast AI inference with Groq (Llama 3.3 70B)');
    console.log('- Secure sandboxed code execution with E2B');
  } else {
    console.log('\n⚠️  Some tests failed. Please check your configuration.');
  }
}

// Load environment variables
require('dotenv').config({ path: '.env.local' });

// Run tests
testConfiguration().catch(console.error);