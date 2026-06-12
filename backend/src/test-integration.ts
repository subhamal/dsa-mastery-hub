import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function runTests() {
  console.log('🧪 Starting DSA Mastery Hub Integration Tests...\n');

  try {
    // 1. Verify Phases
    const phasesCount = await prisma.phase.count();
    console.log(`✅ Phases count in database: ${phasesCount} (Expected: 13)`);
    if (phasesCount !== 13) {
      throw new Error(`Failed: Expected 13 phases, found ${phasesCount}`);
    }

    // 2. Verify Concepts
    const conceptsCount = await prisma.concept.count();
    console.log(`✅ Concepts count in database: ${conceptsCount} (Expected: >= 300)`);
    if (conceptsCount < 300) {
      throw new Error(`Failed: Expected >= 300 concepts, found ${conceptsCount}`);
    }

    // 3. Verify Questions
    const questionsCount = await prisma.question.count();
    console.log(`✅ Practice questions count in database: ${questionsCount} (Expected: >= 1500)`);
    if (questionsCount < 1500) {
      throw new Error(`Failed: Expected >= 1500 questions, found ${questionsCount}`);
    }

    // 4. Verify Interview Questions
    const interviewCount = await prisma.interviewQuestion.count();
    console.log(`✅ Interview questions count in database: ${interviewCount} (Expected: >= 500)`);
    if (interviewCount < 500) {
      throw new Error(`Failed: Expected >= 500 interview questions, found ${interviewCount}`);
    }

    // 5. Verify Demo User
    const demoUser = await prisma.user.findUnique({
      where: { email: 'demo@masteryhub.com' }
    });
    if (!demoUser) {
      throw new Error('Failed: Demo user email not found');
    }
    console.log(`✅ Demo User account verified: ${demoUser.email} / ${demoUser.name} (${demoUser.xp} XP)`);

    console.log('\n🎉 All Integration Tests Passed Successfully!');
  } catch (error: any) {
    console.error(`❌ Integration Test Failed: ${error.message}`);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runTests();
