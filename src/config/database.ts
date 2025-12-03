import { DataSource } from 'typeorm';
import type { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { env } from './env';
import { Logger } from '../utils/logger';

const dataSourceOptions: PostgresConnectionOptions = {
  type: 'postgres',
  url: env.DATABASE_URL,
  // Enable SSL for production databases (Render requires this)
  // Disable SSL for local development databases
  ssl: process.env.NODE_ENV === 'production' 
    ? { rejectUnauthorized: false } 
    : false,
  synchronize: process.env.NODE_ENV === 'development',
  logging: process.env.NODE_ENV === 'development' ? 'all' : ['error'],
  // Adjust paths for compiled JS files in production
  entities: [process.env.NODE_ENV === 'production' ? 'dist/entities/**/*.js' : 'src/entities/**/*.ts'],
  migrations: [process.env.NODE_ENV === 'production' ? 'dist/migrations/**/*.js' : 'src/migrations/**/*.ts'],
};

export const AppDataSource = new DataSource(dataSourceOptions);

export const connectDatabase = async () => {
  try {
    Logger.info('Attempting to connect to database...');
    Logger.info(`Environment: ${process.env.NODE_ENV}`);
    
    await AppDataSource.initialize();
    
    Logger.info('✅ Database connection successful');
    Logger.info(`Connected to database: ${AppDataSource.options.type}`);
  } catch (error) {
    Logger.error('❌ Database connection failed');
    
    if (error instanceof Error) {
      Logger.error(`Error message: ${error.message}`);
      Logger.error(`Error stack: ${error.stack}`);
    } else {
      Logger.error(error);
    }
    
    // Log additional debugging info
    Logger.error('Database configuration:');
    Logger.error(`- Type: ${AppDataSource.options.type}`);
    Logger.error(`- Synchronize: ${AppDataSource.options.synchronize}`);
    
    process.exit(1);
  }
};
