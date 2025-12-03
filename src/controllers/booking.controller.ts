import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../config/database';
import { Booking } from '../entities/booking.entity';
import { User } from '../entities/user.entity';
import { AppError } from '../middleware/error.middleware';
import { Logger } from '../utils/logger';

export const createBooking = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const bookingRepository = AppDataSource.getRepository(Booking);
    const user = (req as any).user as User;

    const newBooking = bookingRepository.create({
      ...req.body,
      user: user,
    }) as unknown as Booking;

    await bookingRepository.save(newBooking);

    Logger.info(`New booking created for user ${user.email} (Service: ${newBooking.serviceType})`);

    res.status(201).json({
      status: 'success',
      data: {
        booking: newBooking,
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      const userEmail = ((req as any).user as User)?.email || 'unknown user';
      Logger.error(`Error creating booking for user ${userEmail}: ${error.message}`);
    }
    next(error);
  }
};

const DEFAULT_PAGE_SIZE = 10;

export const getMyBookings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const bookingRepository = AppDataSource.getRepository(Booking);
    const user = (req as any).user as User;

    const page = parseInt(req.query.page as string, 10) || 1;
    const pageSize = parseInt(req.query.pageSize as string, 10) || DEFAULT_PAGE_SIZE;

    if (isNaN(page) || page < 1) {
      Logger.warn(`Invalid page number provided: ${req.query.page}`);
      return next(new AppError('Invalid page number, must be greater than or equal to 1', 400));
    }

    if (isNaN(pageSize) || pageSize < 1 || pageSize > 100) {
      Logger.warn(`Invalid page size provided: ${req.query.pageSize}`);
      return next(new AppError('Invalid page size, must be between 1 and 100', 400));
    }

    const [bookings, total] = await bookingRepository.findAndCount({
      where: { user: { id: user.id } },
      skip: (page - 1) * pageSize,
      take: pageSize,
      order: {
        createdAt: 'DESC', // Or any other field you want to sort by
      },
    });

    Logger.info(`Retrieved bookings for user ${user.email}, page ${page}, page size ${pageSize}`);
    res.status(200).json({
      status: 'success',
      results: bookings.length,
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
      data: {
        bookings,
      },
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      const userEmail = ((req as any).user as User)?.email || 'unknown user';
      Logger.error(`Error retrieving bookings for user ${userEmail}: ${error.message}`);
    }
    next(error);
  }
};