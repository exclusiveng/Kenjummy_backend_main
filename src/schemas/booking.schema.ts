import { z } from 'zod';

export const createBookingSchema = z.object({
  body: z.object({
    serviceType: z.enum(['charter', 'intercity', 'vip', 'hire'], {
      message: 'Invalid service type. Must be one of: charter, intercity, vip, hire.',
    }),
    fullName: z.string().min(1, { message: 'Full name is required' }),
    phone: z.string().min(1, { message: 'Phone number is required' }),
    email: z.string().min(1, { message: 'Email is required' }).email(),

    // Optional fields for all services
    pickup: z.string().optional(),
    dropoff: z.string().optional(),
    departure: z.string().optional(),
    destination: z.string().optional(),
    date: z.string().optional(), // Dates will come as strings
    time: z.string().optional(),
    vehicle: z.string().optional(),
    duration: z.string().optional(),
    specialRequest: z.string().optional(),
    startDate: z.string().optional(),
    startTime: z.string().optional(),
    endDate: z.string().optional(),
    endTime: z.string().optional(),
    purpose: z.string().optional(),
    days: z.array(z.string()).optional(),
    travelTime: z.string().optional(),
    numberOfPassengers: z.number().optional(),
  }),
});