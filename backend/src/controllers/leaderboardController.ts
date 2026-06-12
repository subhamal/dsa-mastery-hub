import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();

export const getLeaderboard = async (req: AuthRequest, res: Response) => {
  try {
    const topUsers = await prisma.user.findMany({
      orderBy: { xp: 'desc' },
      take: 20,
      select: {
        id: true,
        name: true,
        avatar: true,
        xp: true,
        streak: true
      }
    });

    const leaderboard = topUsers.map((u, idx) => ({
      rank: idx + 1,
      ...u
    }));

    res.json({ leaderboard });
  } catch (error: any) {
    res.status(500).json({ message: 'Error retrieving leaderboard', error: error.message });
  }
};

export const getDashboardStats = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        badges: {
          include: { badge: true }
        }
      }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const conceptCount = await prisma.userProgress.count({
      where: { userId, status: 'COMPLETED' }
    });

    const questionCount = await prisma.userQuestionProgress.count({
      where: { userId, status: 'COMPLETED' }
    });

    res.json({
      xp: user.xp,
      streak: user.streak,
      conceptsCompleted: conceptCount,
      questionsSolved: questionCount,
      badges: user.badges.map(b => b.badge),
      lastActive: user.lastActive
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching stats', error: error.message });
  }
};
