/**
 * Database Connection Module
 * Manages MongoDB connection with Mongoose
 */
import mongoose from 'mongoose';
/**
 * Connect to MongoDB database
 */
export declare const connectDatabase: () => Promise<void>;
/**
 * Disconnect from MongoDB database
 */
export declare const disconnectDatabase: () => Promise<void>;
/**
 * Get Mongoose connection instance
 */
export declare const getConnection: () => mongoose.Connection | null;
declare const _default: {
    connectDatabase: () => Promise<void>;
    disconnectDatabase: () => Promise<void>;
    getConnection: () => mongoose.Connection | null;
};
export default _default;
//# sourceMappingURL=database.d.ts.map