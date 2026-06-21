import { Router, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getDb } from '../db/connection.js';
import { createUserInputSchema, userSchema } from '../shared/schemas/index.js';
import { validateBody } from '../middleware/validation.js';
import { AuthRequest, authenticateApiKey } from '../middleware/auth.js';
import { AppError } from '../middleware/errors.js';

const router = Router();

// POST /api/users - Create a new user (no auth required)
router.post('/', validateBody(createUserInputSchema), async (req: AuthRequest, res: Response) => {
  try {
    const input = req.body;
    const db = await getDb();

    // Check if email already exists
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(input.email);
    if (existing) {
      throw new AppError('EMAIL_EXISTS', 'Email already exists', 400);
    }

    // Create user
    const userId = uuidv4();
    const apiKey = uuidv4() + uuidv4().replace(/-/g, '');
    const now = new Date().toISOString();

    db.prepare(
      'INSERT INTO users (id, name, email, api_key, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)'
    ).run(userId, input.name, input.email, apiKey, now, now);

    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId) as any;
    
    // Transform snake_case to camelCase for schema validation
    const transformedUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      apiKey: user.api_key,
      createdAt: user.created_at,
      updatedAt: user.updated_at
    };
    const parsedUser = userSchema.parse(transformedUser);

    res.json({
      success: true,
      data: { user: parsedUser, apiKey }
    });
  } catch (error: any) {
    throw error;
  }
});

// GET /api/users/me - Get current user (requires auth)
router.get('/me', authenticateApiKey, async (req: AuthRequest, res: Response) => {
  try {
    const db = await getDb();
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.userId!);
    
    if (!user) {
      throw new AppError('NOT_FOUND', 'User not found', 404);
    }

    // Transform snake_case to camelCase for schema validation
    const transformedUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      apiKey: user.api_key,
      createdAt: user.created_at,
      updatedAt: user.updated_at
    };
    const parsedUser = userSchema.parse(transformedUser);
    res.json({
      success: true,
      data: { user: parsedUser }
    });
  } catch (error: any) {
    throw error;
  }
});

export { router as usersRouter };
