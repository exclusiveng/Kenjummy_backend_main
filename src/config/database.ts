import { DataSource } from 'typeorm';
import { env } from './env';
import { Logger } from '../utils/logger';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: env.DATABASE_URL,
  synchronize: env.NODE_ENV === 'development', // Auto-create tables in dev, disable in prod
  logging: env.NODE_ENV === 'development',
  entities: ['src/entities/**/*.ts'],
  migrations: ['src/migrations/**/*.ts'],
  subscribers: ['src/subscribers/**/*.ts'],
});

export const connectDatabase = async () => {
  try {
    await AppDataSource.initialize();
    Logger.info('Database connected successfully');
  } catch (error) {
    Logger.error('Database connection failed');
    Logger.error(error);
    process.exit(1);
  }
};
