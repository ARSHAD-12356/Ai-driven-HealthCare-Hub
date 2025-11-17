import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getDatabase } from '@/lib/mongodb';
import { UserDocument, Admin } from '@/lib/models/user';

/**
 * Admin Login Route
 * 
 * This route is ONLY for admin users.
 * It first checks static admin credentials from environment variables.
 * If those don't match, it checks MongoDB for admin users.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // ============================================
    // STEP 1: Check static admin credentials from .env
    // ============================================
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
    const ADMIN_FULL_NAME = process.env.ADMIN_FULL_NAME || 'Super Admin';

    if (ADMIN_EMAIL && ADMIN_PASSWORD) {
      // Direct string comparison (no hashing for static credentials)
      if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        return NextResponse.json(
          {
            message: 'Admin login successful',
            user: {
              _id: 'static-admin',
              email: ADMIN_EMAIL,
              fullName: ADMIN_FULL_NAME,
              role: 'admin',
              isStaticAdmin: true,
            },
          },
          { status: 200 }
        );
      }
    }

    // ============================================
    // STEP 2: Check MongoDB for admin users
    // ============================================
    const db = await getDatabase();
    const usersCollection = db.collection<UserDocument>('users');

    // Find user by email
    const user = await usersCollection.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // CRITICAL: Only allow admin role to login through this endpoint
    if (user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Access denied. This endpoint is only for administrators.' },
        { status: 403 }
      );
    }

    // Verify password with bcrypt (for MongoDB users)
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Return admin data (without password)
    const { password: _, ...adminWithoutPassword } = user;
    
    return NextResponse.json(
      {
        message: 'Admin login successful',
        user: {
          ...adminWithoutPassword,
          _id: user._id?.toString(),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

