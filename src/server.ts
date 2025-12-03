import 'reflect-metadata';
import app from './app';
import { env } from './config/env';
import { connectDatabase } from './config/database';
import { Logger } from './utils/logger';

const startServer = async () => {
  // Connect to Database
  await connectDatabase();

  // Start Server
  const port = env.PORT;
  app.listen(port, () => {
    Logger.info(`Server running on port ${port}`);
    Logger.info(`Environment: ${env.NODE_ENV}`);
  });
};

startServer().catch((err) => {
  Logger.error('Server failed to start');
  Logger.error(err);
  process.exit(1);
});
