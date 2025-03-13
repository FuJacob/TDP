// apps/backend/src/middleware/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { supabase } from '../utils/supabaseClient';

const white_list = [
  '/api/v1/auth/signup',
  '/api/v1/auth/login',
  '/api/v1/auth/forgotpassword',
  '/api/v1/auth/resetpassword',
  '/'
];

declare module "express" {
  export interface Request {
    user?: {
      userId: string;
      email: string;
      name: string;
    };
  }
}

export const auth = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  if (white_list.some(item => req.originalUrl === item)) {
    return next();
  }

  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')?.[1];

  if (!token) {
    return res.status(401).json({
      message: 'Authorization token is required',
    });
  }

  try {
    // Use Supabase to get the user information from the token
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) {
      throw new Error(error?.message || 'Invalid user');
    }

    req.user = {
      userId: user.id, // Set the actual Supabase UUID
      email: user.email || '',
      name: user.user_metadata?.first_name || '',
    };

    return next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({
      message: 'Invalid or expired token',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

