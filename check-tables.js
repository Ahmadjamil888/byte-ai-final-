import { PrismaClient } from '@prisma/client';

async function checkTables() {
  console.log('🔍 Checking database tables...');
  console.log('🔗 Using DATABASE_URL from environment');
  
  const prisma = new PrismaClient();
  
  try {
    await prisma.$connect();
    console.log('✅ Database connected successfully');
    
    // Check each table
    const userCount = await prisma.user.count();
    console.log(`✅ users table: ${userCount} records`);
    
    const subscriptionCount = await prisma.userSubscription.count();
    console.log(`✅ user_subscriptions table: ${subscriptionCount} records`);
    
    const progressCount = await prisma.userProgress.count();
    console.log(`✅ user_progress table: ${progressCount} records`);
    
    const appCount = await prisma.generatedApp.count();
    console.log(`✅ generated_apps table: ${appCount} records`);
    
    console.log('\n🎉 All subscription tables are ready!');
    console.log('📋 Database migration completed successfully');
    
  } catch (error) {
    console.error('❌ Database error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkTables();