import { DataSource } from 'typeorm';
import { env } from './env';
import { Logger } from '../utils/logger';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: env.DATABASE_URL,
  // Add SSL configuration for production environments like Render
  ssl: env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  synchronize: env.NODE_ENV === 'development',
  logging: env.NODE_ENV === 'development' ? 'all' : ['error'],
  // Adjust paths for compiled JS files in production
  entities: [env.NODE_ENV === 'production' ? 'dist/entities/**/*.js' : 'src/entities/**/*.ts'],
  migrations: [env.NODE_ENV === 'production' ? 'dist/migrations/**/*.js' : 'src/migrations/**/*.ts'],
  subscribers: [env.NODE_ENV === 'production' ? 'dist/subscribers/**/*.js' : 'src/subscribers/**/*.ts'],
});

export const connectDatabase = async () => {
  try {
    await AppDataSource.initialize();
    Logger.info('Database connection successful');
  } catch (error) {
    Logger.error('Database connection failed');
    Logger.error(error);
    process.exit(1);
  }
};
