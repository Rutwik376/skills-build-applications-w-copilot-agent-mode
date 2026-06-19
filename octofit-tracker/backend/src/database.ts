/**
 * Database Connection Module
 * Manages MongoDB connection with Mongoose
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/octofit_db';

/**
 * Connect to MongoDB database
 */
export const connectDatabase = async (): Promise<void> => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✓ Connected to MongoDB');
    console.log(`  Database: octofit_db`);
    console.log(`  URI: ${MONGODB_URI}`);
  } catch (error) {
    console.error('✗ MongoDB connection error:', error);
    process.exit(1);
  }
};

/**
 * Disconnect from MongoDB database
 */
export const disconnectDatabase = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    console.log('✓ Disconnected from MongoDB');
  } catch (error) {
    console.error('✗ MongoDB disconnection error:', error);
  }
};

/**
 * Get Mongoose connection instance
 */
export const getConnection = (): mongoose.Connection | null => {
  return mongoose.connection || null;
};

export default {
  connectDatabase,
  disconnectDatabase,
  getConnection,
};
