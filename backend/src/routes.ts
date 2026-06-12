import { Router } from 'express';
import { register, login, getMe, googleLogin } from './controllers/authController';
import { getRoadmap, getConceptDetails, updateConceptProgress } from './controllers/roadmapController';
import { getQuestions, getQuestionDetails, submitQuestion, bookmarkQuestion, getRevisionPlanner, addRevisionItem } from './controllers/questionController';
import { getLeaderboard, getDashboardStats } from './controllers/leaderboardController';
import { chatTutor, generateHint, reviewCode, interviewSim, generateCustomRoadmap } from './controllers/aiController';
import { authenticateToken, optionalToken } from './middleware/auth';

const router = Router();

// Auth Routes
router.post('/auth/register', register);
router.post('/auth/login', login);
router.post('/auth/google', googleLogin);
router.get('/auth/me', authenticateToken, getMe);

// Roadmap Routes
router.get('/roadmap', optionalToken, getRoadmap);
router.get('/concepts/:slug', optionalToken, getConceptDetails);
router.post('/concepts/:id/complete', authenticateToken, updateConceptProgress);

// Questions Routes
router.get('/questions', optionalToken, getQuestions);
router.get('/questions/:slug', optionalToken, getQuestionDetails);
router.post('/questions/:id/submit', authenticateToken, submitQuestion);
router.post('/questions/:id/bookmark', authenticateToken, bookmarkQuestion);

// Revision Planner
router.get('/revision', authenticateToken, getRevisionPlanner);
router.post('/revision', authenticateToken, addRevisionItem);

// Leaderboard & User Stats
router.get('/leaderboard', optionalToken, getLeaderboard);
router.get('/user/stats', authenticateToken, getDashboardStats);

// AI Assistant routes
router.post('/ai/chat', optionalToken, chatTutor);
router.post('/ai/hint', optionalToken, generateHint);
router.post('/ai/review', optionalToken, reviewCode);
router.post('/ai/interview', optionalToken, interviewSim);
router.post('/ai/roadmap', optionalToken, generateCustomRoadmap);

export default router;
