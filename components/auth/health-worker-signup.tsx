'use client';

import { useState } from 'react';
import { AlertCircle, CheckCircle, XCircle, Upload, FileText, Shield, Building2, Award } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

interface HealthWorkerFormData {
  fullName: string;
  phoneNumber: string;
  email: string;
  password: string;
  confirmPassword: string;
  qualification: string;
  registrationNumber: string;
  yearOfRegistration: string;
  stateMedicalCouncil: string;
  hospitalClinicName: string;
  district: string;
  village: string;
  yearsOfExperience: string;
  specializedStream: string;
  governmentIdFile: File | null;
  proofFile: File | null;
}

type VerificationStatus = 'form' | 'pending' | 'approved' | 'denied';

export default function HealthWorkerSignup({
  onBackClick,
  onSignupSuccess,
}: {
  onBackClick: () => void;
  onSignupSuccess: () => void;
}) {
  const [formData, setFormData] = useState<HealthWorkerFormData>({
    fullName: '',
    phoneNumber: '',
    email: '',
    password: '',
    confirmPassword: '',
    qualification: '',
    registrationNumber: '',
    yearOfRegistration: '',
    stateMedicalCouncil: '',
    hospitalClinicName: '',
    district: '',
    village: '',
    yearsOfExperience: '',
    specializedStream: '',
    governmentIdFile: null,
    proofFile: null,
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>('form');
  const [denialReason, setDenialReason] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const qualifications = ['MBBS', 'MD', 'ANM', 'GNM', 'ASHA', 'Nurse', 'Paramedic', 'Other'];
  
  // Indian State Medical Councils
  const stateMedicalCouncils = [
    'Andhra Pradesh Medical Council',
    'Arunachal Pradesh Medical Council',
    'Assam Medical Council',
    'Bihar Medical Council',
    'Chhattisgarh Medical Council',
    'Goa Medical Council',
    'Gujarat Medical Council',
    'Haryana Medical Council',
    'Himachal Pradesh Medical Council',
    'Jammu & Kashmir Medical Council',
    'Jharkhand Medical Council',
    'Karnataka Medical Council',
    'Kerala Medical Council',
    'Madhya Pradesh Medical Council',
    'Maharashtra Medical Council',
    'Manipur Medical Council',
    'Meghalaya Medical Council',
    'Mizoram Medical Council',
    'Nagaland Medical Council',
    'Odisha Medical Council',
    'Punjab Medical Council',
    'Rajasthan Medical Council',
    'Sikkim Medical Council',
    'Tamil Nadu Medical Council',
    'Telangana Medical Council',
    'Tripura Medical Council',
    'Uttar Pradesh Medical Council',
    'Uttarakhand Medical Council',
    'West Bengal Medical Council',
    'Delhi Medical Council',
    'National Medical Commission (NMC)',
    'Other'
  ];
  
  // Indian Districts and their corresponding Villages
  const districtVillageMap: { [key: string]: string[] } = {
    // Maharashtra
    'Mumbai': ['Andheri', 'Bandra', 'Borivali', 'Chembur', 'Dadar', 'Goregaon', 'Juhu', 'Kandivali', 'Kurla', 'Malad', 'Powai', 'Santacruz', 'Worli'],
    'Pune': ['Aundh', 'Baner', 'Hadapsar', 'Hinjewadi', 'Kharadi', 'Koregaon Park', 'Pimpri', 'Viman Nagar', 'Wakad', 'Warje'],
    'Nagpur': ['Ambazari', 'Dharampeth', 'Gandhibagh', 'Itwari', 'Kalamna', 'Manewada', 'Mankapur', 'Sitabuldi', 'Wardha Road'],
    'Nashik': ['Ambad', 'CIDCO', 'Gangapur Road', 'Nashik Road', 'Panchavati', 'Satpur', 'Trimbak Road'],
    'Aurangabad': ['Aurangpura', 'Cidco', 'Garkheda', 'Jalna Road', 'Kranti Chowk', 'Nageshwar', 'Paithan Road'],
    
    // Delhi
    'New Delhi': ['Connaught Place', 'Karol Bagh', 'Lajpat Nagar', 'Rajendra Place', 'Saket', 'Vasant Kunj'],
    'North Delhi': ['Civil Lines', 'Model Town', 'Pitampura', 'Rohini', 'Shalimar Bagh', 'Wazirabad'],
    'South Delhi': ['Defence Colony', 'Greater Kailash', 'Hauz Khas', 'Lajpat Nagar', 'Malviya Nagar', 'Saket'],
    'East Delhi': ['Geeta Colony', 'Laxmi Nagar', 'Mayur Vihar', 'Preet Vihar', 'Shahdara', 'Yamuna Vihar'],
    'West Delhi': ['Dwarka', 'Janakpuri', 'Paschim Vihar', 'Rajouri Garden', 'Rohini', 'Vikaspuri'],
    
    // Karnataka
    'Bangalore Urban': ['Banaswadi', 'Bannerghatta', 'Electronic City', 'Hebbal', 'HSR Layout', 'Indiranagar', 'Jayanagar', 'Koramangala', 'Marathahalli', 'Whitefield'],
    'Mysore': ['Bannimantap', 'Gokulam', 'Heggadadevanakote', 'Kuvempunagar', 'Nazarbad', 'Vijayanagar'],
    'Mangalore': ['Bejai', 'Kadri', 'Kankanady', 'Kottara', 'Pumpwell', 'Surathkal'],
    'Hubli': ['Dharwad', 'Gokul Road', 'Hubli City', 'Keshwapur', 'Old Hubli', 'Unkal'],
    
    // Tamil Nadu
    'Chennai': ['Adyar', 'Anna Nagar', 'Chrompet', 'Guindy', 'Mylapore', 'Porur', 'T Nagar', 'Velachery'],
    'Coimbatore': ['Gandhipuram', 'Peelamedu', 'Ramanathapuram', 'RS Puram', 'Saravanampatti', 'Sitra'],
    'Madurai': ['Anna Nagar', 'K K Nagar', 'Melur', 'Tallakulam', 'Thirunagar', 'Villapuram'],
    'Salem': ['Hasthampatti', 'Kondalampatti', 'Suramangalam', 'Tharamangalam', 'Yercaud'],
    
    // Gujarat
    'Ahmedabad': ['Bopal', 'Gandhinagar', 'Ghatlodia', 'Maninagar', 'Navrangpura', 'Paldi', 'Satellite', 'Vastrapur'],
    'Surat': ['Adajan', 'Athwa', 'Katargam', 'Piplod', 'Rander', 'Udhna', 'Varachha'],
    'Vadodara': ['Akota', 'Alkapuri', 'Fatehgunj', 'Karelibaug', 'Makarpura', 'Sayajigunj'],
    'Rajkot': ['Gondal Road', 'Kalavad Road', 'Mavdi', 'Race Course', 'University Road'],
    
    // West Bengal
    'Kolkata': ['Alipore', 'Ballygunge', 'Behala', 'Dum Dum', 'Park Street', 'Salt Lake', 'Tollygunge'],
    'Howrah': ['Bally', 'Belur', 'Dankuni', 'Santragachi', 'Uluberia'],
    'Hooghly': ['Chandannagar', 'Chinsurah', 'Serampore', 'Tarakeswar'],
    'North 24 Parganas': ['Barasat', 'Barrackpore', 'Bidhannagar', 'Dum Dum', 'Kalyani'],
    
    // Uttar Pradesh
    'Lucknow': ['Alambagh', 'Aminabad', 'Gomti Nagar', 'Hazratganj', 'Indira Nagar', 'Mahanagar', 'Rajajipuram'],
    'Kanpur': ['Arya Nagar', 'Kakadeo', 'Lajpat Nagar', 'Panki', 'Swaroop Nagar'],
    'Agra': ['Dayalbagh', 'Kamla Nagar', 'Khandari', 'Shahganj', 'Tajganj'],
    'Varanasi': ['Assi', 'Bhelupur', 'Cantt', 'Lanka', 'Sigra', 'Varanasi City'],
    'Allahabad': ['Civil Lines', 'Kareli', 'Katra', 'Muir Road', 'Naini'],
    
    // Rajasthan
    'Jaipur': ['Bani Park', 'C Scheme', 'Malviya Nagar', 'Mansarovar', 'Raja Park', 'Tonk Road', 'Vaishali Nagar'],
    'Jodhpur': ['Basni', 'Chopasani', 'Mandore', 'Pal', 'Ratanada', 'Shastri Nagar'],
    'Udaipur': ['Bapu Bazar', 'Dudh Talai', 'Fateh Sagar', 'Hiran Magri', 'Sukhadia Circle'],
    'Kota': ['Borkhera', 'Dadabari', 'Kunhadi', 'Mahaveer Nagar', 'Talwandi'],
    
    // Punjab
    'Amritsar': ['Batala Road', 'Cantonment', 'Guru Nanak Nagar', 'Lawrence Road', 'Ranjit Avenue'],
    'Ludhiana': ['BRS Nagar', 'Civil Lines', 'Ferozepur Road', 'Model Town', 'Sarabha Nagar'],
    'Chandigarh': ['Sector 17', 'Sector 22', 'Sector 35', 'Sector 43', 'Sector 44'],
    
    // Haryana
    'Gurgaon': ['DLF Phase 1', 'DLF Phase 2', 'DLF Phase 3', 'Sector 14', 'Sector 15', 'Sohna Road'],
    'Faridabad': ['Ballabgarh', 'NIT', 'Sector 15', 'Sector 16', 'Sector 21'],
    'Panipat': ['Model Town', 'Old Panipat', 'Samalkha', 'Ugra Kheri'],
    
    // Andhra Pradesh
    'Hyderabad': ['Banjara Hills', 'Gachibowli', 'Hitech City', 'Jubilee Hills', 'Kondapur', 'Madhapur', 'Secunderabad'],
    'Vijayawada': ['Benz Circle', 'Gandhi Nagar', 'Labbipet', 'One Town', 'Patamata'],
    'Visakhapatnam': ['Dabagardens', 'Gajuwaka', 'MVP Colony', 'Seethammadhara', 'Waltair'],
    
    // Telangana
    'Warangal': ['Hanamkonda', 'Kazipet', 'Subedari', 'Vidyaranyapuri'],
    'Karimnagar': ['Huzurabad', 'Jagtial', 'Peddapalli', 'Sircilla'],
    
    // Kerala
    'Thiruvananthapuram': ['Kowdiar', 'Nanthancode', 'Pattom', 'Sreekaryam', 'Vazhuthacaud'],
    'Kochi': ['Edapally', 'Fort Kochi', 'Kadavanthra', 'Marine Drive', 'Vyttila'],
    'Kozhikode': ['Arayidathupalam', 'Feroke', 'Mavoor Road', 'Puthiyara', 'Tali'],
    
    // Madhya Pradesh
    'Bhopal': ['Arera Colony', 'Hoshangabad Road', 'Kolar', 'MP Nagar', 'New Market', 'Shahpura'],
    'Indore': ['Bhawarkua', 'MG Road', 'Rau', 'Saket Nagar', 'Vijay Nagar'],
    'Gwalior': ['City Center', 'Lashkar', 'Morar', 'Thatipur'],
    
    // Bihar
    'Patna': ['Boring Road', 'Danapur', 'Kankarbagh', 'Rajendra Nagar', 'Saguna More'],
    'Gaya': ['Bodh Gaya', 'Civil Lines', 'Kotwali', 'Magadh University'],
    'Muzaffarpur': ['Bela', 'Kalyani Nagar', 'Lalbagh', 'Sakri'],
    
    // Odisha
    'Bhubaneswar': ['Acharya Vihar', 'Bapuji Nagar', 'Khandagiri', 'Nayapalli', 'Sahid Nagar'],
    'Cuttack': ['Buxi Bazar', 'Choudhury Bazar', 'Jagatpur', 'Link Road'],
    
    // Assam
    'Guwahati': ['Beltola', 'Dispur', 'Ganeshguri', 'Lalganesh', 'Paltan Bazar'],
    'Jorhat': ['Borbheta', 'Gar Ali', 'Tarajan'],
    
    // Jharkhand
    'Ranchi': ['Bariatu', 'Harmu', 'Lalpur', 'Main Road', 'Morabadi'],
    'Jamshedpur': ['Bistupur', 'Kadma', 'Sakchi', 'Sonari'],
    
    // Chhattisgarh
    'Raipur': ['Fafadih', 'G E Road', 'Pandri', 'Shankar Nagar'],
    'Bilaspur': ['Bilaspur City', 'Koni', 'Mungeli Road'],
    
    // Uttarakhand
    'Dehradun': ['Clement Town', 'Dalanwala', 'Rajpur Road', 'Vikasnagar'],
    'Haridwar': ['BHEL', 'Jwalapur', 'Kankhal', 'Rishikesh'],
    
    // Himachal Pradesh
    'Shimla': ['Chhota Shimla', 'Lakkar Bazar', 'Mall Road', 'Sanjauli'],
    'Kangra': ['Dharamshala', 'McLeod Ganj', 'Palampur'],
    
    // Jammu and Kashmir
    'Srinagar': ['Dal Lake', 'Hazratbal', 'Lal Chowk', 'Rajbagh'],
    'Jammu': ['Bahu Fort', 'Gandhi Nagar', 'Jammu City', 'Tawi'],
    
    // Other States
    'Goa': ['Calangute', 'Mapusa', 'Margao', 'Panaji', 'Vasco'],
    'Puducherry': ['Karaikal', 'Pondicherry', 'Yanam'],
  };

  const districts = Object.keys(districtVillageMap).sort();
  
  // Get villages for selected district
  const getVillagesForDistrict = (district: string): string[] => {
    return districtVillageMap[district] || [];
  };

  const specializedStreams = [
    'General Practice',
    'Pediatrics',
    'Gynecology',
    'Cardiology',
    'Orthopedics',
    'Dermatology',
    'Psychiatry',
    'Emergency Medicine',
    'Public Health',
    'Community Health',
    'Other'
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // If district changes, reset village
    if (name === 'district') {
      setFormData((prev) => ({ ...prev, [name]: value, village: '' }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, [fieldName]: file }));
      if (errors[fieldName]) {
        setErrors((prev) => ({ ...prev, [fieldName]: '' }));
      }
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (step === 1) {
      if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
      if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required';
      if (!formData.email.trim()) newErrors.email = 'Email is required';
      if (!formData.password || formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    } else if (step === 2) {
      if (!formData.qualification) newErrors.qualification = 'Qualification is required';
      if (!formData.registrationNumber.trim()) {
        newErrors.registrationNumber = 'Medical registration number is required';
      }
      if (!formData.yearOfRegistration.trim()) {
        newErrors.yearOfRegistration = 'Year of registration is required';
      }
      if (!formData.stateMedicalCouncil) {
        newErrors.stateMedicalCouncil = 'State Medical Council is required';
      }
      if (!formData.governmentIdFile) newErrors.governmentIdFile = 'Government ID upload is required';
    } else if (step === 3) {
      if (!formData.hospitalClinicName.trim()) {
        newErrors.hospitalClinicName = 'Hospital/Clinic name is required';
      }
      if (!formData.district) newErrors.district = 'District is required';
      if (!formData.village) newErrors.village = 'Village is required';
      if (!formData.yearsOfExperience) newErrors.yearsOfExperience = 'Years of experience is required';
      if (!formData.specializedStream.trim()) {
        newErrors.specializedStream = 'Specialized stream is required';
      }
      if (!formData.proofFile) newErrors.proofFile = 'Proof document is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateStep(3)) {
      return;
    }

    try {
      // Prepare submission data for MongoDB
      const submissionData = {
        role: 'health-worker',
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
        phoneNumber: formData.phoneNumber,
        qualification: formData.qualification,
        registrationNumber: formData.registrationNumber,
        yearOfRegistration: formData.yearOfRegistration,
        stateMedicalCouncil: formData.stateMedicalCouncil,
        hospitalClinicName: formData.hospitalClinicName,
        district: formData.district,
        village: formData.village,
        yearsOfExperience: formData.yearsOfExperience,
        specializedStream: formData.specializedStream,
        governmentIdFileName: formData.governmentIdFile?.name || '',
        proofFileName: formData.proofFile?.name || '',
      };

      // Call MongoDB API for signup
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      });

      const data = await response.json();

      if (!response.ok) {
        // Don't throw - set error in state instead
        setErrors({ 
          submit: data.error || 'Signup failed. Please try again.' 
        });
        return;
      }

      console.log('Health worker signup successful:', data);
      setVerificationStatus('pending');
    } catch (error) {
      console.error('Signup error:', error);
      setErrors({ 
        submit: error instanceof Error ? error.message : 'Failed to submit application. Please try again.' 
      });
    }
  };

  const handleResubmit = () => {
    setVerificationStatus('form');
    setCurrentStep(1);
    setDenialReason('');
  };

  // Pending Review State
  if (verificationStatus === 'pending') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
        <div className="max-w-lg w-full bg-card border border-border rounded-xl p-8 text-center space-y-6 shadow-lg">
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center animate-pulse">
              <AlertCircle className="w-10 h-10 text-primary" />
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-3xl font-bold text-foreground">Pending Review</h2>
            <p className="text-muted-foreground text-base">
              Your signup request will be reviewed by the administrator.
            </p>
          </div>

          <div className="bg-primary/10 border-l-4 border-primary p-5 rounded-lg text-left space-y-3">
            <p className="text-sm font-semibold text-foreground">What happens next?</p>
            <ul className="text-sm text-muted-foreground space-y-2.5 list-none">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <span>Admin will verify your credentials (typically 1-2 business days)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <span>You will receive approval/denial notification via email</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <span>Once approved, you can log in and access all features</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <span>Confirmation email will be sent to <strong>{formData.email}</strong></span>
              </li>
            </ul>
          </div>

          <div className="bg-muted/50 border border-border rounded-lg p-4">
            <p className="text-xs text-muted-foreground font-mono">
              Status: <span className="text-primary font-bold">PENDING_REVIEW</span>
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <Button
              onClick={onBackClick}
              className="w-full"
            >
              Return to Home
            </Button>
            <p className="text-xs text-muted-foreground">
              <strong>Note:</strong> Login will remain disabled until your application is approved by the administrator.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Approved State
  if (verificationStatus === 'approved') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
        <div className="max-w-lg w-full bg-card border border-border rounded-xl p-8 text-center space-y-6 shadow-lg">
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-3xl font-bold text-foreground">Application Approved!</h2>
            <p className="text-muted-foreground text-base">
              Your credentials have been verified and approved by the administrator.
            </p>
          </div>

          <div className="bg-green-500/10 border-l-4 border-green-500 p-5 rounded-lg text-left space-y-3">
            <p className="text-sm font-semibold text-foreground">You can now:</p>
            <ul className="text-sm text-muted-foreground space-y-2.5 list-none">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Log in with your email and password</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Access all health worker features</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>View and manage patient cases</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Submit reports and data</span>
              </li>
            </ul>
          </div>

          <Button
            onClick={onBackClick}
            className="w-full"
            size="lg"
          >
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  // Denied State - Show as Dialog Popup
  const showDeniedDialog = verificationStatus === 'denied';

  // Main Form Submission State
  return (
    <>
      {/* Denied Dialog Popup */}
      <AlertDialog open={showDeniedDialog} onOpenChange={(open) => {
        if (!open) {
          // Allow closing - user can resubmit or go back
          handleResubmit();
        }
      }}>
        <AlertDialogContent className="sm:max-w-md">
          <AlertDialogHeader>
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-destructive/20 rounded-full flex items-center justify-center">
                <XCircle className="w-8 h-8 text-destructive" />
              </div>
            </div>
            <AlertDialogTitle className="text-center text-2xl">
              Admin Denied Your Request
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center pt-2">
              Your registration request has been denied by the administrator.
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          {denialReason && (
            <div className="bg-destructive/10 border-l-4 border-destructive p-4 rounded-lg text-left space-y-2">
              <p className="text-sm font-semibold text-foreground">Reason:</p>
              <p className="text-sm text-muted-foreground">{denialReason}</p>
            </div>
          )}

          <p className="text-xs text-muted-foreground text-center italic">
            Contact the administrator at support@healthcare.local for more information.
          </p>

          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              onClick={handleResubmit}
              className="w-full sm:w-auto"
            >
              Resubmit Details
            </Button>
            <Button
              onClick={onBackClick}
              variant="outline"
              className="w-full sm:w-auto"
            >
              Return to Home
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-4">
        <div className="max-w-3xl mx-auto">
          <button
            onClick={onBackClick}
            className="text-primary font-semibold text-sm flex items-center gap-1 hover:text-primary/80 mb-8 transition-colors group"
          >
            <span className="group-hover:-translate-x-1 transition-transform">←</span> Back
          </button>

          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  Health Worker Registration
                </h1>
                <p className="text-muted-foreground">
                  Complete verification form to access the platform
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="flex gap-2 mb-4">
              {[1, 2, 3].map((step) => (
                <div
                  key={step}
                  className={`flex-1 h-2 rounded-full transition-all ${
                    step <= currentStep ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              ))}
            </div>
            <p className="text-sm text-muted-foreground font-medium">
              Step {currentStep} of 3: {currentStep === 1 ? 'Personal Details' : currentStep === 2 ? 'Credentials & Verification' : 'Assignment & Documents'}
            </p>
          </div>

          {/* Important Notice Banner */}
          <div className="mb-6 bg-primary/10 border-l-4 border-primary p-5 rounded-lg shadow-sm">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-foreground mb-1">Administrator Review Required</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Your signup request will be reviewed by the administrator. <strong>Login will be disabled until your application is approved.</strong> You will be notified via email once the review is complete (typically within 1-2 business days).
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Step 1: Personal Details */}
            {currentStep === 1 && (
              <div className="bg-card border border-border rounded-xl p-6 space-y-5 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-5 h-5 text-primary" />
                  <h2 className="text-lg font-semibold text-foreground">Personal Information</h2>
                </div>
                
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Full Name <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter your full name as per ID"
                    className={`w-full px-4 py-3 rounded-lg border-2 transition-colors ${
                      errors.fullName ? 'border-destructive focus:border-destructive' : 'border-border focus:border-primary'
                    } bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20`}
                  />
                  {errors.fullName && <p className="text-xs text-destructive mt-1.5 flex items-center gap-1">
                    <XCircle className="w-3 h-3" /> {errors.fullName}
                  </p>}
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Phone Number <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="10-digit phone number"
                    maxLength={10}
                    className={`w-full px-4 py-3 rounded-lg border-2 transition-colors ${
                      errors.phoneNumber ? 'border-destructive focus:border-destructive' : 'border-border focus:border-primary'
                    } bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20`}
                  />
                  {errors.phoneNumber && <p className="text-xs text-destructive mt-1.5 flex items-center gap-1">
                    <XCircle className="w-3 h-3" /> {errors.phoneNumber}
                  </p>}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Email Address <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    className={`w-full px-4 py-3 rounded-lg border-2 transition-colors ${
                      errors.email ? 'border-destructive focus:border-destructive' : 'border-border focus:border-primary'
                    } bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20`}
                  />
                  {errors.email && <p className="text-xs text-destructive mt-1.5 flex items-center gap-1">
                    <XCircle className="w-3 h-3" /> {errors.email}
                  </p>}
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Password <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Minimum 6 characters"
                    className={`w-full px-4 py-3 rounded-lg border-2 transition-colors ${
                      errors.password ? 'border-destructive focus:border-destructive' : 'border-border focus:border-primary'
                    } bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20`}
                  />
                  {errors.password && <p className="text-xs text-destructive mt-1.5 flex items-center gap-1">
                    <XCircle className="w-3 h-3" /> {errors.password}
                  </p>}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Confirm Password <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Re-enter your password"
                    className={`w-full px-4 py-3 rounded-lg border-2 transition-colors ${
                      errors.confirmPassword ? 'border-destructive focus:border-destructive' : 'border-border focus:border-primary'
                    } bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20`}
                  />
                  {errors.confirmPassword && <p className="text-xs text-destructive mt-1.5 flex items-center gap-1">
                    <XCircle className="w-3 h-3" /> {errors.confirmPassword}
                  </p>}
                </div>

                {/* Terms */}
                <div className="pt-2 border-t border-border">
                  <p className="text-xs text-muted-foreground">
                    By signing up, you agree to our <a href="#" className="text-primary hover:underline">Terms of Service</a> and <a href="#" className="text-primary hover:underline">Privacy Policy</a>
                  </p>
                </div>
              </div>
            )}

            {/* Step 2: Credentials & Verification */}
            {currentStep === 2 && (
              <div className="bg-card border border-border rounded-xl p-6 space-y-5 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Award className="w-5 h-5 text-primary" />
                  <h2 className="text-lg font-semibold text-foreground">Professional Credentials</h2>
                </div>
                
                {/* Qualification */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Qualification (MBBS, ANM, GNM, etc.) <span className="text-destructive">*</span>
                  </label>
                  <select
                    name="qualification"
                    value={formData.qualification}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg border-2 transition-colors ${
                      errors.qualification ? 'border-destructive focus:border-destructive' : 'border-border focus:border-primary'
                    } bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20`}
                  >
                    <option value="">Select qualification</option>
                    {qualifications.map((qual) => (
                      <option key={qual} value={qual}>
                        {qual}
                      </option>
                    ))}
                  </select>
                  {errors.qualification && <p className="text-xs text-destructive mt-1.5 flex items-center gap-1">
                    <XCircle className="w-3 h-3" /> {errors.qualification}
                  </p>}
                </div>

                {/* Medical Registration Number */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Medical Registration Number / License Number <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="text"
                    name="registrationNumber"
                    value={formData.registrationNumber}
                    onChange={handleChange}
                    placeholder="e.g., REG123456 or MCI-12345"
                    className={`w-full px-4 py-3 rounded-lg border-2 transition-colors ${
                      errors.registrationNumber ? 'border-destructive focus:border-destructive' : 'border-border focus:border-primary'
                    } bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20`}
                  />
                  {errors.registrationNumber && <p className="text-xs text-destructive mt-1.5 flex items-center gap-1">
                    <XCircle className="w-3 h-3" /> {errors.registrationNumber}
                  </p>}
                </div>

                {/* Year of Registration */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Year of Registration <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="number"
                    name="yearOfRegistration"
                    value={formData.yearOfRegistration}
                    onChange={handleChange}
                    placeholder="e.g., 2015"
                    min="1950"
                    max={new Date().getFullYear()}
                    className={`w-full px-4 py-3 rounded-lg border-2 transition-colors ${
                      errors.yearOfRegistration ? 'border-destructive focus:border-destructive' : 'border-border focus:border-primary'
                    } bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20`}
                  />
                  {errors.yearOfRegistration && <p className="text-xs text-destructive mt-1.5 flex items-center gap-1">
                    <XCircle className="w-3 h-3" /> {errors.yearOfRegistration}
                  </p>}
                </div>

                {/* State Medical Council */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    State Medical Council <span className="text-destructive">*</span>
                  </label>
                  <select
                    name="stateMedicalCouncil"
                    value={formData.stateMedicalCouncil}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg border-2 transition-colors ${
                      errors.stateMedicalCouncil ? 'border-destructive focus:border-destructive' : 'border-border focus:border-primary'
                    } bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20`}
                  >
                    <option value="">Select State Medical Council</option>
                    {stateMedicalCouncils.map((council) => (
                      <option key={council} value={council}>
                        {council}
                      </option>
                    ))}
                  </select>
                  {errors.stateMedicalCouncil && <p className="text-xs text-destructive mt-1.5 flex items-center gap-1">
                    <XCircle className="w-3 h-3" /> {errors.stateMedicalCouncil}
                  </p>}
                </div>

                {/* Government ID Upload */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Government ID Upload (Aadhaar/ID Card) <span className="text-destructive">*</span>
                  </label>
                  <div className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
                    errors.governmentIdFile 
                      ? 'border-destructive bg-destructive/5' 
                      : 'border-border hover:border-primary hover:bg-primary/5'
                  }`}>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => handleFileChange(e, 'governmentIdFile')}
                      className="hidden"
                      id="govId"
                    />
                    <label htmlFor="govId" className="cursor-pointer flex flex-col items-center gap-3">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        formData.governmentIdFile ? 'bg-primary/10' : 'bg-muted'
                      }`}>
                        <Upload className={`w-6 h-6 ${formData.governmentIdFile ? 'text-primary' : 'text-muted-foreground'}`} />
                      </div>
                      <div>
                        <span className="text-sm font-semibold text-foreground block">
                          {formData.governmentIdFile?.name || 'Click to upload ID document'}
                        </span>
                        <span className="text-xs text-muted-foreground mt-1 block">PNG, JPG, PDF up to 5MB</span>
                      </div>
                    </label>
                  </div>
                  {errors.governmentIdFile && <p className="text-xs text-destructive mt-1.5 flex items-center gap-1">
                    <XCircle className="w-3 h-3" /> {errors.governmentIdFile}
                  </p>}
                </div>
              </div>
            )}

            {/* Step 3: Assignment & Documents */}
            {currentStep === 3 && (
              <div className="bg-card border border-border rounded-xl p-6 space-y-5 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Building2 className="w-5 h-5 text-primary" />
                  <h2 className="text-lg font-semibold text-foreground">Workplace & Experience</h2>
                </div>
                
                {/* Hospital/Clinic Name */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Hospital/Clinic Name <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="text"
                    name="hospitalClinicName"
                    value={formData.hospitalClinicName}
                    onChange={handleChange}
                    placeholder="Enter your workplace name"
                    className={`w-full px-4 py-3 rounded-lg border-2 transition-colors ${
                      errors.hospitalClinicName ? 'border-destructive focus:border-destructive' : 'border-border focus:border-primary'
                    } bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20`}
                  />
                  {errors.hospitalClinicName && <p className="text-xs text-destructive mt-1.5 flex items-center gap-1">
                    <XCircle className="w-3 h-3" /> {errors.hospitalClinicName}
                  </p>}
                </div>

                {/* District & Village */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">
                      District <span className="text-destructive">*</span>
                    </label>
                    <select
                      name="district"
                      value={formData.district}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-lg border-2 transition-colors ${
                        errors.district ? 'border-destructive focus:border-destructive' : 'border-border focus:border-primary'
                      } bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20`}
                    >
                      <option value="">Select district</option>
                      {districts.map((dist) => (
                        <option key={dist} value={dist}>
                          {dist}
                        </option>
                      ))}
                    </select>
                    {errors.district && <p className="text-xs text-destructive mt-1.5 flex items-center gap-1">
                      <XCircle className="w-3 h-3" /> {errors.district}
                    </p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">
                      Village <span className="text-destructive">*</span>
                    </label>
                    <select
                      name="village"
                      value={formData.village}
                      onChange={handleChange}
                      disabled={!formData.district}
                      className={`w-full px-4 py-3 rounded-lg border-2 transition-colors ${
                        errors.village ? 'border-destructive focus:border-destructive' : 'border-border focus:border-primary'
                      } bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                        !formData.district ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      <option value="">
                        {formData.district ? 'Select village' : 'Select district first'}
                      </option>
                      {formData.district && getVillagesForDistrict(formData.district).map((v) => (
                        <option key={v} value={v}>
                          {v}
                        </option>
                      ))}
                    </select>
                    {errors.village && <p className="text-xs text-destructive mt-1.5 flex items-center gap-1">
                      <XCircle className="w-3 h-3" /> {errors.village}
                    </p>}
                  </div>
                </div>

                {/* Years of Experience */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Years of Experience <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="number"
                    name="yearsOfExperience"
                    value={formData.yearsOfExperience}
                    onChange={handleChange}
                    placeholder="e.g., 5"
                    min="0"
                    max="50"
                    className={`w-full px-4 py-3 rounded-lg border-2 transition-colors ${
                      errors.yearsOfExperience ? 'border-destructive focus:border-destructive' : 'border-border focus:border-primary'
                    } bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20`}
                  />
                  {errors.yearsOfExperience && <p className="text-xs text-destructive mt-1.5 flex items-center gap-1">
                    <XCircle className="w-3 h-3" /> {errors.yearsOfExperience}
                  </p>}
                </div>

                {/* Specialized Stream */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Specialized Stream <span className="text-destructive">*</span>
                  </label>
                  <select
                    name="specializedStream"
                    value={formData.specializedStream}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg border-2 transition-colors ${
                      errors.specializedStream ? 'border-destructive focus:border-destructive' : 'border-border focus:border-primary'
                    } bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20`}
                  >
                    <option value="">Select specialized stream</option>
                    {specializedStreams.map((stream) => (
                      <option key={stream} value={stream}>
                        {stream}
                      </option>
                    ))}
                  </select>
                  {errors.specializedStream && <p className="text-xs text-destructive mt-1.5 flex items-center gap-1">
                    <XCircle className="w-3 h-3" /> {errors.specializedStream}
                  </p>}
                </div>

                {/* Proof Upload */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Upload Proof (Certificate / License Photo) <span className="text-destructive">*</span>
                  </label>
                  <div className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
                    errors.proofFile 
                      ? 'border-destructive bg-destructive/5' 
                      : 'border-border hover:border-primary hover:bg-primary/5'
                  }`}>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => handleFileChange(e, 'proofFile')}
                      className="hidden"
                      id="proof"
                    />
                    <label htmlFor="proof" className="cursor-pointer flex flex-col items-center gap-3">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        formData.proofFile ? 'bg-primary/10' : 'bg-muted'
                      }`}>
                        <Upload className={`w-6 h-6 ${formData.proofFile ? 'text-primary' : 'text-muted-foreground'}`} />
                      </div>
                      <div>
                        <span className="text-sm font-semibold text-foreground block">
                          {formData.proofFile?.name || 'Click to upload proof document'}
                        </span>
                        <span className="text-xs text-muted-foreground mt-1 block">PNG, JPG, PDF up to 5MB</span>
                      </div>
                    </label>
                  </div>
                  {errors.proofFile && <p className="text-xs text-destructive mt-1.5 flex items-center gap-1">
                    <XCircle className="w-3 h-3" /> {errors.proofFile}
                  </p>}
                </div>
              </div>
            )}

            {/* Submit Error Message */}
            {errors.submit && (
              <div className="mt-4 p-4 bg-destructive/10 border-l-4 border-destructive rounded-lg">
                <div className="flex items-start gap-2">
                  <XCircle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-destructive mb-1">Signup Error</p>
                    <p className="text-sm text-destructive/90">{errors.submit}</p>
                    {errors.submit.includes('already exists') && (
                      <p className="text-xs text-muted-foreground mt-2">
                        Try using a different email address or{' '}
                        <button
                          onClick={onBackClick}
                          className="text-primary hover:underline font-semibold"
                        >
                          go to login
                        </button>
                        {' '}if you already have an account.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-4 mt-8">
              {currentStep > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setCurrentStep(currentStep - 1);
                    setErrors({});
                  }}
                  className="flex-1"
                >
                  Previous
                </Button>
              )}

              {currentStep < 3 ? (
                <Button
                  type="button"
                  onClick={() => {
                    if (validateStep(currentStep)) {
                      setCurrentStep(currentStep + 1);
                      setErrors({});
                    }
                  }}
                  className="flex-1"
                >
                  Next
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="flex-1"
                >
                  Submit for Verification
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
