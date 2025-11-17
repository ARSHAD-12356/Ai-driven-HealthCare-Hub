import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { HealthWorker } from '@/lib/models/user';

// GET - Get all pending health workers (for admin)
export async function GET(request: NextRequest) {
  try {
    const db = await getDatabase();
    const usersCollection = db.collection<HealthWorker>('users');

    const status = request.nextUrl.searchParams.get('status') || 'pending';
    
    const healthWorkers = await usersCollection
      .find({ 
        role: 'health-worker',
        status: status as 'pending' | 'approved' | 'denied'
      })
      .toArray();

    // Remove passwords from response
    const workersWithoutPasswords = healthWorkers.map(({ password, ...worker }) => ({
      ...worker,
      _id: worker._id?.toString(),
    }));

    return NextResponse.json(
      { healthWorkers: workersWithoutPasswords },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get health workers error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

