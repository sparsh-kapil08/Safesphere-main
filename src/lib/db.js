
import mongoose from 'mongoose';
import { Sequelize } from 'sequelize';
import path from 'path';

// --- MongoDB Configuration ---
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/safesphere';

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectMongo() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

// --- SQL Configuration (SQLite via Sequelize) ---
// Using SQLite for local file-based SQL DB. Easy to transition to Postgres/MySQL.
export const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(process.cwd(), 'safesphere.sqlite'),
  logging: false,
});

export async function connectSQL() {
  try {
    await sequelize.authenticate();
    console.log('SQL Database connected successfully.');
    await sequelize.sync(); // Create tables if they don't exist
  } catch (error) {
    console.error('Unable to connect to the SQL database:', error);
  }
}
