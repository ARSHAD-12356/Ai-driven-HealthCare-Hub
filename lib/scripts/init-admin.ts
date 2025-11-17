/**
 * Admin Initialization Script
 * 
 * This script automatically creates a single admin user when the server starts,
 * but only if an admin does not already exist in MongoDB.
 * 
 * Run this on server startup to ensure there's always exactly one admin.
 */

import bcrypt from 'bcryptjs';
import { getDatabase } from '@/lib/mongodb';
import { UserDocument, Admin } from '@/lib/models/user';

// Admin credentials - CHANGE THESE IN PRODUCTION!
// In production, use environment variables for security
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@ruralhealthcare.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Admin@123456';
const ADMIN_FULL_NAME = process.env.ADMIN_FULL_NAME || 'System Administrator';

/**
 * Initialize admin user in the database
 * Only creates admin if one doesn't already exist
 */
export async function initializeAdmin(): Promise<void> {
  try {
    console.log('🔐 Checking for admin user...');
    
    const db = await getDatabase();
    const usersCollection = db.collection<UserDocument>('users');

    // Check if admin already exists
    const existingAdmin = await usersCollection.findOne({ role: 'admin' });
    
    if (existingAdmin) {
      console.log('✅ Admin user already exists. Skipping creation.');
      return;
    }

    // Hash the admin password
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

    // Create admin user document
    const now = new Date();
    const adminDoc: Admin = {
      email: ADMIN_EMAIL,
      password: hashedPassword,
      role: 'admin',
      fullName: ADMIN_FULL_NAME,
      createdAt: now,
      updatedAt: now,
    };

    // Insert admin into database
    const result = await usersCollection.insertOne(adminDoc);

    console.log('✅ Admin user created successfully!');
    console.log(`   Email: ${ADMIN_EMAIL}`);
    console.log(`   Password: ${ADMIN_PASSWORD}`);
    console.log(`   ID: ${result.insertedId}`);
    console.log('⚠️  IMPORTANT: Change the admin password after first login!');
    
  } catch (error) {
    console.error('❌ Failed to initialize admin user:', error);
    // Don't throw - we don't want to crash the server if admin init fails
    // The admin can be created manually if needed
  }
}

/**
 * Call this function when your Next.js server starts
 * You can add this to your app initialization or API route
 */
export async function runAdminInit(): Promise<void> {
  // Add a small delay to ensure MongoDB connection is ready
  setTimeout(async () => {
    await initializeAdmin();
  }, 1000);
}

