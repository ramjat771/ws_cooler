import mongoose from 'mongoose';
import { MONGO_URI } from './env.mjs';

const connectDB = async () => {
  try {
        console.log( `✅MongoDB connected1 ${MONGO_URI}`);
    await mongoose.connect(MONGO_URI);
    console.log('✅ MongoDB connected');
  } catch (err) {
    console.error('❌ DB connection error:', err.message);
    process.exit(1);
  }
};

export const mongoConnection= connectDB;
