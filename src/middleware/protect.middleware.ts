import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from './error.middleware';
import { User } from '../entities/user.entity';
import { AppDataSource } from '../config/database';
import { Logger } from '../utils/logger';

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // 1) Getting token and check if it's there
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) {
      return next(new AppError('You are not logged in! Please log in to get access.', 401));
    }

    // 2) Verification token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };

    // 3) Check if user still exists
    const userRepository = AppDataSource.getRepository(User);
    const currentUser = await userRepository.findOneBy({ id: decoded.id });

    if (!currentUser) {
      return next(new AppError('The user belonging to this token no longer exists.', 401));
    }

    // GRANT ACCESS TO PROTECTED ROUTE
    // Attach user to the request object
    (req as any).user = currentUser;
    next();
  } catch (error: unknown) {
    if (error instanceof Error) {
      Logger.error(`Authentication error: ${error.message}`);
    }
    return next(new AppError('Invalid or expired token. Please log in again.', 401));
  }
};