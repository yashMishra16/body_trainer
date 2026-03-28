import { Router, Request, Response } from 'express';
import { rateLimit } from 'express-rate-limit';
import { z } from 'zod';
import jwt from 'jsonwebtoken';
import {
  createUser,
  getUserById,
  getUserByEmail,
  updateUser,
  verifyPassword,
} from '../services/userService';

const router = Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many authentication attempts, please try again later',
});

const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2),
  age: z.number().optional(),
  gender: z.string().optional(),
  heightCm: z.number().optional(),
  weightKg: z.number().optional(),
  fitnessLevel: z.string().optional(),
  goals: z.array(z.string()).optional(),
  dietType: z.string().optional(),
});

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

function generateToken(userId: string): string {
  const secret = process.env.JWT_SECRET || 'dev_secret';
  return jwt.sign({ userId }, secret, { expiresIn: '7d' });
}

// Register
router.post('/register', async (req: Request, res: Response) => {
  try {
    const input = RegisterSchema.parse(req.body);
    const user = await createUser(input);
    const token = generateToken(user.id);

    const { ...userWithoutPassword } = user as typeof user & { password_hash?: string };
    delete userWithoutPassword.password_hash;

    res.status(201).json({ user: userWithoutPassword, token });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation failed', details: error.errors });
    }
    console.error('Register error:', error);
    return res.status(500).json({ error: 'Registration failed' });
  }
});

// Login (rate limited to prevent brute force)
router.post('/login', authLimiter, async (req: Request, res: Response) => {
  try {
    const { email, password } = LoginSchema.parse(req.body);

    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValid = await verifyPassword(password, user.password_hash);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user.id);
    const { password_hash: _ph, ...userWithoutPassword } = user;

    return res.json({ user: userWithoutPassword, token });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Login failed' });
  }
});

// Get profile
router.get('/profile/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params['id'] as string;
    const user = await getUserById(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    return res.json({ user });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to get profile' });
  }
});

// Update profile
router.put('/profile/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params['id'] as string;
    const user = await updateUser(id, req.body);
    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

export default router;
