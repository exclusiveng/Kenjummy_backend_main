import { Request, Response, NextFunction } from 'express';
import { ZodObject, ZodError } from 'zod';
import { AppError } from './error.middleware';
import { Logger } from '../utils/logger';

export const validate = (schema: ZodObject<any>) => (req: Request, res: Response, next: NextFunction) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      Logger.warn(`Validation Error: ${error.issues.map(i => i.message).join(', ')}`);
      return next(new AppError(`Invalid input: ${error.issues.map(i => i.message).join(', ')}`, 400));
    }
    next(error);
  }
};