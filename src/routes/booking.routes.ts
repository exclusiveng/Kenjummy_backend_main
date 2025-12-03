import { Router } from 'express';
import { createBooking, getMyBookings } from '../controllers/booking.controller';
import { protect } from '../middleware/protect.middleware';
import { validate } from '../middleware/validate.middleware';
import { createBookingSchema } from '../schemas/booking.schema';

const router = Router();

// All routes below this are protected
router.use(protect);

router.route('/my-bookings').get(getMyBookings);
router.route('/').post(validate(createBookingSchema), createBooking);

// Example for getting a single booking: router.get('/:id', getBookingById);

export default router;