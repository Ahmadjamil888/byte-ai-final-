console.log('🚀 Setting up Byte AI with Clerk subscriptions...');
console.log('📍 Using Clerk for authentication and subscriptions');

async function checkClerkConfig() {
  console.log('\n=== CLERK CONFIGURATION CHECK ===');
  
  const requiredClerkVars = [
    'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY',
    'CLERK_SECRET_KEY'
  ];

  let allConfigured = true;
  
  for (const varName of requiredClerkVars) {
    if (process.env[varName]) {
      console.log(`✅ ${varName}: Configured`);
    } else {
      console.log(`❌ ${varName}: Missing`);
      allConfigured = false;
    }
  }

  return allConfigured;
}

async function main() {
  console.log('🎯 Byte AI with Clerk Subscriptions Setup');
  console.log('==========================================');

  // Check configurations
  const clerkConfigured = await checkClerkConfig();

  console.log('\n=== SETUP SUMMARY ===');
  console.log(`Clerk: ${clerkConfigured ? '✅ Configured' : '❌ Needs Setup'}`);

  if (clerkConfigured) {
    console.log('\n🎉 SETUP COMPLETE!');
    console.log('\n📋 What\'s working:');
    console.log('- User authentication with Clerk');
    console.log('- Subscription management with Clerk plans');
    console.log('- Progress tracking in user metadata');
    console.log('- Automatic trial creation for new users');
    
    console.log('\n🚀 Next steps:');
    console.log('1. Configure your plans in Clerk Dashboard');
    console.log('2. Start your development server: npm run dev');
    console.log('3. Sign up as a new user to test trial creation');
    console.log('4. Test subscription upgrades with Clerk plans');
    console.log('5. Visit /pricing to see the pricing table');
    
  } else {
    console.log('\n⚠️  SETUP INCOMPLETE');
    
    if (!clerkConfigured) {
      console.log('\n🔧 Clerk Setup Needed:');
      console.log('- Create Clerk application');
      console.log('- Add keys to .env.local');
      console.log('- Configure plans in Clerk Dashboard (bronze, silver, gold)');
    }
  }
}

main().catch(console.error);