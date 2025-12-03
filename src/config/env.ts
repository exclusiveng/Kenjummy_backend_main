import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform((val) => parseInt(val, 10)).default(3000),
  DATABASE_URL: z.string().url(),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) { 
  // If parsing fails, it means required environment variables are missing or invalid.
  // It's crucial to halt the application startup in such cases to prevent unexpected behavior.
  // Log the error in a structured format for better debugging.
  // Ensure that the error message includes details about the missing/invalid variables.

  console.error(' Invalid environment variables:', JSON.stringify(parsedEnv.error.format(), null, 4));
  process.exit(1);
}

export const env = parsedEnv.data;
