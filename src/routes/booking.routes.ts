import { Router } from 'express';
import { createBooking, getMyBookings, getAllBookings, updateBookingStatus } from '../controllers/booking.controller';
import { protect, restrictTo } from '../middleware/protect.middleware';
import { validate } from '../middleware/validate.middleware';
import { createBookingSchema } from '../schemas/booking.schema';

const router = Router();

// All routes below this are protected
router.use(protect);

// Admin routes (admin or superadmin)
router.get('/all', restrictTo('admin', 'superadmin'), getAllBookings);
router.patch('/:id/status', restrictTo('admin', 'superadmin'), updateBookingStatus);

// User routes
router.route('/my-bookings').get(getMyBookings);
router.route('/').post(validate(createBookingSchema), createBooking);

// Example for getting a single booking: router.get('/:id', getBookingById);

export default router;