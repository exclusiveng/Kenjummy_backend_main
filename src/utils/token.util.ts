import jwt from 'jsonwebtoken';
import { Response } from 'express';
import { User } from '../entities/user.entity';
import { Logger } from './logger';

const signToken = (id: string) => {
  if (!process.env.JWT_SECRET) {
    Logger.error('FATAL: JWT_SECRET is not defined in environment variables.');
    throw new Error('Server configuration error: JWT secret is missing.');
  }
  return jwt.sign({ id }, process.env.JWT_SECRET!, {
    expiresIn: '30d',
  });
};
 
export const createSendToken = (user: User, statusCode: number, res: Response) => {
  const token = signToken(user.id);

  const cookieOptions = {
    expires: new Date(Date.now() + parseInt(process.env.JWT_COOKIE_EXPIRES_IN!) * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  };

  res.cookie('jwt', token, cookieOptions);

  // Remove password from output
  const { password, ...userWithoutPassword } = user;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user: userWithoutPassword,
    },
  });
};