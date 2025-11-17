import { NextRequest, NextResponse } from 'next/server';
import { initializeAdmin } from '@/lib/scripts/init-admin';

/**
 * Admin Initialization API Route
 * 
 * This endpoint can be called to initialize the admin user.
 * It's safe to call multiple times - it will only create an admin if one doesn't exist.
 * 
 * You can call this on server startup or manually trigger it.
 */
export async function POST(request: NextRequest) {
  try {
    await initializeAdmin();
    
    return NextResponse.json(
      { message: 'Admin initialization completed' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Admin initialization error:', error);
    return NextResponse.json(
      { error: 'Failed to initialize admin' },
      { status: 500 }
    );
  }
}

/**
 * GET endpoint to check if admin exists
 */
export async function GET() {
  try {
    const { getDatabase } = await import('@/lib/mongodb');
    const { UserDocument } = await import('@/lib/models/user');
    
    const db = await getDatabase();
    const usersCollection = db.collection<UserDocument>('users');
    
    const admin = await usersCollection.findOne({ role: 'admin' });
    
    return NextResponse.json(
      { 
        adminExists: !!admin,
        adminEmail: admin?.email || null
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Admin check error:', error);
    return NextResponse.json(
      { error: 'Failed to check admin status' },
      { status: 500 }
    );
  }
}

