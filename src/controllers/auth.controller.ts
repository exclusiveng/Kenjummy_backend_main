import { Request, Response, NextFunction } from 'express';
import { User } from '../entities/user.entity';
import { AppError } from '../middleware/error.middleware';
import { AppDataSource } from '../config/database';
import { createSendToken } from '../utils/token.util';
import { Logger } from '../utils/logger';
import { LoginInput, SignupInput } from '../schemas/auth.schema';
import { validationResult } from 'express-validator';
import { editUserSchema } from '../schemas/edituser.schema';


import { env } from '../config/env';

export const signup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { fullName, email, phone, password, adminSecret } = req.body as SignupInput;
    const userRepository = AppDataSource.getRepository(User);

    let role: 'user' | 'admin' = 'user';

    // Check if admin secret is provided and matches the environment variable
    if (adminSecret && env.ADMIN_SECRET_KEY && adminSecret === env.ADMIN_SECRET_KEY) {
      role = 'admin';
    }

    const newUser = userRepository.create({ fullName, email, phone, password, role });
    await userRepository.save(newUser);

    Logger.info(`New user signed up: ${newUser.email} (ID: ${newUser.id})`);
    createSendToken(newUser, 201, res);
  } catch (error) {
    // Type guard to safely access error properties
    if (error instanceof Error) {
      Logger.error(`Error during signup for email: ${req.body.email} - ${error.message}`);
      // Handle duplicate email error (code '23505' for PostgreSQL)
      if ((error as any).code === '23505') {
        return next(new AppError('This email address is already in use.', 400));
      }
    }
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body as LoginInput;

    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository
      .createQueryBuilder('user')
      .where('user.email = :email', { email })
      .addSelect('user.password')
      .getOne();

    if (!user || !(await user.comparePassword(password))) {
      return next(new AppError('Incorrect email or password', 401));
    }

    Logger.info(`User logged in successfully: ${user.email}`);
    createSendToken(user, 200, res);
  } catch (error) {
    // Type guard to safely access error.message
    if (error instanceof Error) {
      Logger.error(`Error during login attempt for: ${req.body.email} - ${error.message}`);
    }
    next(error);
  }
};

export const editUserDetail = async (req: Request & { user?: User }, res: Response, next: NextFunction, ) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const userId = req.params.id;

    // Authorization: Check if the logged-in user is editing their own profile
    if (req.user?.id !== userId) {
      return next(new AppError('You are not authorized to perform this action', 403));
    }

    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOneBy({ id: userId });

    if (!user) {
      return next(new AppError('User not found', 404));
    }

    // Update user details based on the request body
    const { fullName, email, phone } = req.body;
    user.fullName = fullName || user.fullName;
    user.email = email || user.email;
    user.phone = phone || user.phone;

    // Save the updated user
    await userRepository.save(user);

    Logger.info(`User details updated successfully: ${user.email}`);

    res.status(200).json({ message: 'User details updated successfully', user });
  } catch (error) {
    if (error instanceof Error) {
      Logger.error(`Error updating user ${req.params.id}: ${error.message}`);
      if ((error as any).code === '23505') {
        return next(new AppError('This email address is already in use.', 400));
      }
    }
    next(error);
  }
};