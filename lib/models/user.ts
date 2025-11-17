import { ObjectId } from 'mongodb';

export interface User {
  _id?: ObjectId;
  email: string;
  password: string; // hashed
  role: 'patient' | 'health-worker' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}

export interface Patient extends User {
  role: 'patient';
  fullName: string;
  phoneNumber?: string;
  dateOfBirth?: Date;
  address?: string;
}

export interface HealthWorker extends User {
  role: 'health-worker';
  fullName: string;
  phoneNumber: string;
  qualification: string;
  registrationNumber: string;
  yearOfRegistration?: string;
  stateMedicalCouncil?: string;
  hospitalClinicName: string;
  district: string;
  village: string;
  yearsOfExperience: string;
  specializedStream: string;
  governmentIdFileName?: string;
  proofFileName?: string;
  status: 'pending' | 'approved' | 'denied';
  appliedDate: Date;
  denialReason?: string;
}

export interface Admin extends User {
  role: 'admin';
  fullName: string;
}

export type UserDocument = Patient | HealthWorker | Admin;



