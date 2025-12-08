import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../config/database';
import { User } from '../entities/user.entity';
import { AppError } from '../middleware/error.middleware';
import { Logger } from '../utils/logger';

const userRepository = AppDataSource.getRepository(User);

export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;

        const [users, total] = await userRepository.findAndCount({
            order: { createdAt: 'DESC' },
            skip,
            take: limit,
        });

        res.status(200).json({
            status: 'success',
            results: users.length,
            total,
            page,
            totalPages: Math.ceil(total / limit),
            data: {
                users,
            },
        });
    } catch (error) {
        next(error);
    }
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const user = await userRepository.findOneBy({ id });

        if (!user) {
            return next(new AppError('No user found with that ID', 404));
        }

        await userRepository.remove(user);

        Logger.info(`User deleted: ${user.email} by admin`);

        res.status(204).json({
            status: 'success',
            data: null,
        });
    } catch (error) {
        next(error);
    }
};

export const updateUserStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { isActive } = req.body;

        const user = await userRepository.findOneBy({ id });

        if (!user) {
            return next(new AppError('No user found with that ID', 404));
        }

        user.isActive = isActive;
        await userRepository.save(user);

        Logger.info(`User status updated: ${user.email} is now ${isActive ? 'active' : 'suspended'}`);

        res.status(200).json({
            status: 'success',
            data: {
                user,
            },
        });
    } catch (error) {
        next(error);
    }
};

export const promoteToAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        const user = await userRepository.findOneBy({ id });

        if (!user) {
            return next(new AppError('No user found with that ID', 404));
        }

        user.role = 'admin';
        await userRepository.save(user);

        Logger.info(`User promoted to admin: ${user.email}`);

        res.status(200).json({
            status: 'success',
            data: {
                user,
            },
        });
    } catch (error) {
        next(error);
    }
};
