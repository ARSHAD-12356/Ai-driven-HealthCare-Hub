import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getDatabase } from '@/lib/mongodb';
import { UserDocument, Patient, HealthWorker } from '@/lib/models/user';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { role, email, password, ...otherData } = body;

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // CRITICAL: Reject admin role registration through this public endpoint
    if (role === 'admin') {
      return NextResponse.json(
        { error: 'Admin registration not allowed through this endpoint' },
        { status: 403 }
      );
    }

    // Validate role (only patient and health-worker allowed)
    if (!['patient', 'health-worker'].includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role. Only patient and health-worker roles are allowed.' },
        { status: 400 }
      );
    }

    // Validate password length
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    let db;
    try {
      db = await getDatabase();
    } catch (dbError: any) {
      console.error('Database connection error:', {
        message: dbError?.message,
        code: dbError?.code,
        errorResponse: dbError?.errorResponse,
      });
      
      let errorMessage = dbError?.message || 'Database connection failed.';
      
      // Provide helpful error messages
      if (dbError?.message?.includes('authentication failed') || dbError?.code === 8000 || dbError?.errorResponse?.code === 8000) {
        errorMessage = 'MongoDB authentication failed. Please: 1) Verify username/password in MongoDB Atlas → Database Access, 2) Get connection string from Atlas → Connect → Connect your application, 3) Update .env.local and restart server.';
      } else if (dbError?.message?.includes('timeout')) {
        errorMessage = 'Connection timeout. Please check your network connection.';
      }
      
      return NextResponse.json(
        { error: errorMessage },
        { status: 500 }
      );
    }
    
    // Test the connection with a simple operation
    try {
      await db.admin().ping();
    } catch (pingError: any) {
      // If ping fails, try a simple collection operation instead
      console.log('Admin ping failed, trying collection operation...');
    }
    
    const usersCollection = db.collection<UserDocument>('users');

    // Check if user already exists
    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user document based on role
    const now = new Date();
    let userDoc: UserDocument;

    if (role === 'patient') {
      userDoc = {
        email,
        password: hashedPassword,
        role: 'patient',
        fullName: otherData.fullName || '',
        phoneNumber: otherData.phoneNumber,
        dateOfBirth: otherData.dateOfBirth ? new Date(otherData.dateOfBirth) : undefined,
        address: otherData.address,
        createdAt: now,
        updatedAt: now,
      } as Patient;
    } else if (role === 'health-worker') {
      userDoc = {
        email,
        password: hashedPassword,
        role: 'health-worker',
        fullName: otherData.fullName || '',
        phoneNumber: otherData.phoneNumber || '',
        qualification: otherData.qualification || '',
        registrationNumber: otherData.registrationNumber || '',
        yearOfRegistration: otherData.yearOfRegistration || '',
        stateMedicalCouncil: otherData.stateMedicalCouncil || '',
        hospitalClinicName: otherData.hospitalClinicName || '',
        district: otherData.district || '',
        village: otherData.village || '',
        yearsOfExperience: otherData.yearsOfExperience || '',
        specializedStream: otherData.specializedStream || '',
        governmentIdFileName: otherData.governmentIdFileName,
        proofFileName: otherData.proofFileName,
        status: 'pending',
        appliedDate: now,
        denialReason: undefined,
        createdAt: now,
        updatedAt: now,
      } as HealthWorker;
    } else {
      // This should never be reached due to earlier validation, but keep as safety check
      return NextResponse.json(
        { error: 'Invalid role. Admin registration is not allowed.' },
        { status: 403 }
      );
    }

    // Insert user into database
    const result = await usersCollection.insertOne(userDoc);

    // Return success (don't return password)
    const { password: _, ...userWithoutPassword } = userDoc;
    
    return NextResponse.json(
      {
        message: 'User created successfully',
        user: {
          ...userWithoutPassword,
          _id: result.insertedId.toString(),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Signup error:', error);
    
    // Handle JSON parsing errors
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 }
      );
    }
    
    // Handle other errors
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}



