import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { HealthWorker } from '@/lib/models/user';

// PATCH - Update health worker status (approve/deny)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json();
    const { status, denialReason } = body;
    const { id } = await params;

    console.log('🔍 [PATCH] Received request:', { id, status, denialReason });

    // Validate status
    if (!status || !['approved', 'denied'].includes(status)) {
      console.error('❌ Invalid status:', status);
      return NextResponse.json(
        { error: 'Invalid status. Must be "approved" or "denied"' },
        { status: 400 }
      );
    }

    // Validate ID format
    if (!id || !ObjectId.isValid(id)) {
      console.error('❌ Invalid ObjectId format:', id);
      return NextResponse.json(
        { error: 'Invalid worker ID format' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const usersCollection = db.collection<HealthWorker>('users');

    const updateData: any = {
      status,
      updatedAt: new Date(),
    };

    if (status === 'denied' && denialReason) {
      updateData.denialReason = denialReason;
    } else if (status === 'approved') {
      updateData.denialReason = undefined;
    }

    console.log('📊 Update data:', updateData);

    const objectId = new ObjectId(id);
    console.log('🔄 Updating worker with ObjectId:', objectId.toString());

    const result = await usersCollection.updateOne(
      { _id: objectId, role: 'health-worker' },
      { $set: updateData }
    );

    console.log('📈 Update result:', { matchedCount: result.matchedCount, modifiedCount: result.modifiedCount });

    if (result.matchedCount === 0) {
      console.error('❌ Health worker not found with ID:', id);
      return NextResponse.json(
        { error: 'Health worker not found or not a health-worker role' },
        { status: 404 }
      );
    }

    if (result.modifiedCount === 0) {
      console.warn('⚠️ Worker found but no changes made. Worker already has status:', status);
    }

    console.log('✅ Successfully updated health worker status to:', status);

    return NextResponse.json(
      { 
        message: `Health worker ${status} successfully`,
        matchedCount: result.matchedCount,
        modifiedCount: result.modifiedCount
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('❌ [PATCH] Update health worker error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: `Internal server error: ${errorMessage}` },
      { status: 500 }
    );
  }
}

