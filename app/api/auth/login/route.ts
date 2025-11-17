import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getDatabase } from '@/lib/mongodb';
import { UserDocument, HealthWorker } from '@/lib/models/user';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, role } = body;

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

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

    // CRITICAL: Prevent admin from logging in through this regular endpoint
    // Admins must use /api/admin/login
    if (user.role === 'admin') {
      return NextResponse.json(
        { error: 'Administrators must use the admin login page at /admin/login' },
        { status: 403 }
      );
    }

    // Check if role matches
    if (role && user.role !== role) {
      return NextResponse.json(
        { error: 'Invalid role for this account' },
        { status: 403 }
      );
    }

    // For health workers, check approval status
    if (user.role === 'health-worker') {
      const healthWorker = user as HealthWorker;
      if (healthWorker.status === 'pending') {
        return NextResponse.json(
          { error: 'Your account is pending approval. Please wait for administrator approval.' },
          { status: 403 }
        );
      }
      if (healthWorker.status === 'denied') {
        return NextResponse.json(
          { error: 'Your account has been denied. Please contact administrator.' },
          { status: 403 }
        );
      }
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Return user data (without password)
    const { password: _, ...userWithoutPassword } = user;
    
    return NextResponse.json(
      {
        message: 'Login successful',
        user: {
          ...userWithoutPassword,
          _id: user._id?.toString(),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

