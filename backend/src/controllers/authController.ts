import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();

const generateToken = (userId: string) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'super-secret', { expiresIn: '7d' });
};

export const register = async (req: AuthRequest, res: Response) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name,
        avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(name)}`
      }
    });

    const token = generateToken(user.id);
    res.status(201).json({
      token,
      user: { id: user.id, email: user.email, name: user.name, avatar: user.avatar, xp: user.xp, streak: user.streak }
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
};

export const login = async (req: AuthRequest, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Update streak logic
    let currentStreak = user.streak;
    const now = new Date();
    const lastActive = new Date(user.lastActive);
    const diffTime = Math.abs(now.getTime() - lastActive.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      currentStreak += 1;
    } else if (diffDays > 1) {
      currentStreak = 1;
    } else if (currentStreak === 0) {
      currentStreak = 1;
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        streak: currentStreak,
        lastActive: now
      }
    });

    const token = generateToken(updatedUser.id);
    res.json({
      token,
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        avatar: updatedUser.avatar,
        xp: updatedUser.xp,
        streak: updatedUser.streak
      }
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
};

export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        badges: {
          include: {
            badge: true
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        xp: user.xp,
        streak: user.streak,
        lastActive: user.lastActive,
        badges: user.badges.map(b => b.badge)
      }
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching profile', error: error.message });
  }
};

export const googleLogin = async (req: AuthRequest, res: Response) => {
  try {
    const { email, name, googleId, avatar } = req.body;

    if (!email || !name) {
      return res.status(400).json({ message: 'Google authentication details missing' });
    }

    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      // Create random password hash for social logins
      const randomPassword = Math.random().toString(36).substring(2, 15);
      const passwordHash = await bcrypt.hash(randomPassword, 10);
      user = await prisma.user.create({
        data: {
          email,
          name,
          passwordHash,
          avatar: avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(name)}`
        }
      });
    }

    const token = generateToken(user.id);
    res.json({
      token,
      user: { id: user.id, email: user.email, name: user.name, avatar: user.avatar, xp: user.xp, streak: user.streak }
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Google Login Error', error: error.message });
  }
};
