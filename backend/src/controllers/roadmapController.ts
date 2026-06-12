import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();

export const getRoadmap = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    // Fetch all phases with their concepts
    const phases = await prisma.phase.findMany({
      orderBy: { order: 'asc' },
      include: {
        concepts: {
          orderBy: { order: 'asc' },
          select: {
            id: true,
            title: true,
            slug: true,
            order: true,
            description: true
          }
        }
      }
    });

    if (!userId) {
      // User not logged in, return roadmap without user progress stats
      return res.json({
        phases: phases.map(p => ({
          ...p,
          completedCount: 0,
          totalConcepts: p.concepts.length,
          concepts: p.concepts.map(c => ({ ...c, status: 'NOT_STARTED' }))
        }))
      });
    }

    // Get user progress for concepts
    const userProgress = await prisma.userProgress.findMany({
      where: { userId }
    });

    const progressMap = new Map(userProgress.map(p => [p.conceptId, p.status]));
    const bookmarkMap = new Map(userProgress.map(p => [p.conceptId, p.bookmarked]));

    const processedPhases = phases.map(p => {
      let completedCount = 0;
      const conceptsWithProgress = p.concepts.map(c => {
        const status = progressMap.get(c.id) || 'NOT_STARTED';
        const bookmarked = bookmarkMap.get(c.id) || false;
        if (status === 'COMPLETED') completedCount++;
        return {
          ...c,
          status,
          bookmarked
        };
      });

      return {
        id: p.id,
        title: p.title,
        slug: p.slug,
        description: p.description,
        order: p.order,
        totalConcepts: p.concepts.length,
        completedCount,
        concepts: conceptsWithProgress
      };
    });

    res.json({ phases: processedPhases });
  } catch (error: any) {
    res.status(500).json({ message: 'Error retrieving roadmap', error: error.message });
  }
};

export const getConceptDetails = async (req: AuthRequest, res: Response) => {
  try {
    const { slug } = req.params;
    const userId = req.user?.id;

    const concept = await prisma.concept.findUnique({
      where: { slug },
      include: {
        questions: {
          select: {
            id: true,
            title: true,
            slug: true,
            difficulty: true,
            acceptanceRate: true
          }
        },
        interviewQuestions: {
          select: {
            id: true,
            title: true,
            company: true,
            frequency: true
          }
        }
      }
    });

    if (!concept) {
      return res.status(404).json({ message: 'Concept not found' });
    }

    let userStatus = 'NOT_STARTED';
    let bookmarked = false;
    let notes = '';

    if (userId) {
      const prog = await prisma.userProgress.findUnique({
        where: {
          userId_conceptId: { userId, conceptId: concept.id }
        }
      });
      if (prog) {
        userStatus = prog.status;
        bookmarked = prog.bookmarked;
        notes = prog.notes || '';
      }

      // Add question-specific user progress
      const qProgress = await prisma.userQuestionProgress.findMany({
        where: {
          userId,
          questionId: { in: concept.questions.map(q => q.id) }
        }
      });

      const qProgMap = new Map(qProgress.map(qp => [qp.questionId, qp.status]));
      concept.questions = concept.questions.map(q => ({
        ...q,
        status: qProgMap.get(q.id) || 'NOT_STARTED'
      })) as any;
    }

    res.json({
      concept: {
        ...concept,
        status: userStatus,
        bookmarked,
        userNotes: notes
      }
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Error retrieving concept details', error: error.message });
  }
};

export const updateConceptProgress = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status, notes, bookmarked } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const currentProg = await prisma.userProgress.findUnique({
      where: {
        userId_conceptId: { userId, conceptId: id }
      }
    });

    let awardXP = 0;
    const isNowCompleted = status === 'COMPLETED' && (!currentProg || currentProg.status !== 'COMPLETED');

    if (isNowCompleted) {
      awardXP = 15; // 15 XP for completing a concept
    }

    const prog = await prisma.userProgress.upsert({
      where: {
        userId_conceptId: { userId, conceptId: id }
      },
      update: {
        status: status !== undefined ? status : undefined,
        notes: notes !== undefined ? notes : undefined,
        bookmarked: bookmarked !== undefined ? bookmarked : undefined,
        completedAt: isNowCompleted ? new Date() : undefined
      },
      create: {
        userId,
        conceptId: id,
        status: status || 'IN_PROGRESS',
        notes: notes || '',
        bookmarked: bookmarked || false,
        completedAt: isNowCompleted ? new Date() : null
      }
    });

    if (awardXP > 0) {
      // Award XP and create transaction
      await prisma.user.update({
        where: { id: userId },
        data: { xp: { increment: awardXP } }
      });

      await prisma.xPTransaction.create({
        data: {
          userId,
          points: awardXP,
          reason: `Completed concept: ${id}`
        }
      });

      // Check Badges trigger
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (user) {
        const earnedBadges = await prisma.userBadge.findMany({ where: { userId } });
        const earnedBadgeIds = new Set(earnedBadges.map(eb => eb.badgeId));

        const eligibleBadges = await prisma.badge.findMany({
          where: {
            xpRequired: { lte: user.xp }
          }
        });

        for (const b of eligibleBadges) {
          if (!earnedBadgeIds.has(b.id)) {
            await prisma.userBadge.create({
              data: {
                userId,
                badgeId: b.id
              }
            });
          }
        }
      }
    }

    res.json({ message: 'Progress updated successfully', progress: prog, awardXP });
  } catch (error: any) {
    res.status(500).json({ message: 'Error updating concept progress', error: error.message });
  }
};
