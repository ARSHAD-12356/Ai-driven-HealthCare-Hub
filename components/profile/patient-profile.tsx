'use client';

import { useState, useEffect } from 'react';
import { User, Camera, Save, X, Edit2 } from 'lucide-react';
import { Patient } from '@/lib/models/user';

interface PatientProfileProps {
  onBack: () => void;
}

export default function PatientProfile({ onBack }: PatientProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<Partial<Patient>>({
    fullName: '',
    email: '',
    phoneNumber: '',
    dateOfBirth: '',
    address: '',
  });

  // Load user data from localStorage
  useEffect(() => {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      try {
        const user = JSON.parse(currentUser) as Patient;
        setProfileData({
          fullName: user.fullName || '',
          email: user.email || '',
          phoneNumber: user.phoneNumber || '',
          dateOfBirth: user.dateOfBirth 
            ? new Date(user.dateOfBirth).toISOString().split('T')[0]
            : '',
          address: user.address || '',
        });
        
        // Load profile picture from localStorage if exists
        const savedPic = localStorage.getItem(`profilePic_${user.email}`);
        if (savedPic) {
          setProfilePic(savedPic);
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    }
  }, []);

  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setProfilePic(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const currentUser = localStorage.getItem('currentUser');
      if (currentUser) {
        const user = JSON.parse(currentUser) as Patient;
        
        // Update user data
        const updatedUser = {
          ...user,
          ...profileData,
          dateOfBirth: profileData.dateOfBirth ? new Date(profileData.dateOfBirth) : undefined,
        };
        
        // Save to localStorage
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        
        // Save profile picture
        if (profilePic) {
          localStorage.setItem(`profilePic_${user.email}`, profilePic);
        }

        window.dispatchEvent(new Event('patient-profile-updated'));
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to save profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    // Reload original data
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      const user = JSON.parse(currentUser) as Patient;
      setProfileData({
        fullName: user.fullName || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
        dateOfBirth: user.dateOfBirth 
          ? new Date(user.dateOfBirth).toISOString().split('T')[0]
          : '',
        address: user.address || '',
      });
      
      const savedPic = localStorage.getItem(`profilePic_${user.email}`);
      setProfilePic(savedPic || null);
    }
    setIsEditing(false);
  };

  const quickStats = [
    { label: 'Appointments', value: '03', sub: 'Scheduled this month' },
    { label: 'Medicines', value: '05', sub: 'Active prescriptions' },
    { label: 'Wellness Score', value: '86%', sub: 'Steady progress' },
  ];

  const wellnessInsights = [
    { title: 'Hydration', status: 'On Track', detail: '2.5 L average daily intake' },
    { title: 'Sleep Quality', status: 'Needs Attention', detail: 'Avg 5.8 hrs last week' },
    { title: 'Activity Level', status: 'Great', detail: '4 walks logged this week' },
  ];

  const careTimeline = [
    { id: 1, title: 'Follow-up with Dr. Rajesh', date: '18 Nov 2025', status: 'Completed', desc: 'Cold & Flu review' },
    { id: 2, title: 'Lab report uploaded', date: '15 Nov 2025', status: 'Uploaded', desc: 'Blood work results' },
    { id: 3, title: 'Emergency contact updated', date: '11 Nov 2025', status: 'Profile', desc: 'Added new phone number' },
  ];

  const nextVisit = {
    doctor: 'Dr. Priya Singh',
    date: '21 Nov 2025',
    time: '11:30 AM',
    mode: 'Video consultation',
  };

  const firstName = profileData.fullName?.split(' ')[0] || 'Friend';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-4 pb-32">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="text-primary font-semibold text-sm flex items-center gap-1 hover:text-primary/80"
          >
            ← Back
          </button>
          <h1 className="text-2xl font-extrabold text-foreground">Patient Experience Hub</h1>
          <div className="w-20" />
        </div>

        <section className="rounded-3xl bg-gradient-to-br from-primary via-accent to-secondary text-white p-8 relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.1),transparent_45%)] opacity-70"></div>
          <div className="relative flex flex-col lg:flex-row gap-6 lg:items-center">
            <div className="flex-1 space-y-4">
              <p className="text-xs uppercase tracking-[0.4em] text-white/80">Welcome back</p>
              <h2 className="text-3xl font-black">Hi {firstName}, keep shining!</h2>
              <p className="text-sm text-white/80 max-w-xl">
                Track profile, appointments, reminders, and personal wellness goals from this single beautiful dashboard.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                {quickStats.map((stat) => (
                  <div key={stat.label} className="rounded-2xl bg-white/15 backdrop-blur-lg p-4">
                    <p className="text-xs uppercase tracking-widest text-white/70">{stat.label}</p>
                    <p className="text-2xl font-black">{stat.value}</p>
                    <p className="text-xs text-white/80">{stat.sub}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col items-center gap-3">
              <div className="relative">
                <div className="w-32 h-32 rounded-[28px] bg-white/20 backdrop-blur-lg flex items-center justify-center overflow-hidden border-4 border-white/40 shadow-2xl">
                  {profilePic ? (
                    <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-16 h-16 text-white/80" />
                  )}
                </div>
              </div>
              <p className="text-xs text-white/80">Profile synced with your devices</p>
            </div>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-[1.6fr,1fr]">
          <section className="bg-card border border-border rounded-3xl p-6 space-y-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-widest">Profile</p>
                <h3 className="text-xl font-bold text-foreground">Personal Information</h3>
              </div>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 flex items-center gap-2"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </button>
              )}
            </div>

            <div className="flex flex-col items-center">
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center overflow-hidden border-4 border-primary/20">
                  {profilePic ? (
                    <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-16 h-16 text-primary-foreground" />
                  )}
                </div>
                {isEditing && (
                  <label className="absolute bottom-0 right-0 bg-primary text-primary-foreground p-2 rounded-full cursor-pointer hover:bg-primary/90 transition-all shadow-lg">
                    <Camera className="w-5 h-5" />
                    <input type="file" accept="image/*" onChange={handleProfilePicChange} className="hidden" />
                  </label>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                {isEditing ? 'Click camera icon to change photo' : 'Profile Picture'}
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Full Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="fullName"
                    value={profileData.fullName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-border bg-background text-foreground focus:border-primary focus:outline-none"
                  />
                ) : (
                  <div className="px-4 py-3 rounded-xl bg-muted text-foreground">{profileData.fullName || 'Not set'}</div>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Email Address</label>
                <div className="px-4 py-3 rounded-xl bg-muted text-foreground">{profileData.email || 'Not set'}</div>
                <p className="text-xs text-muted-foreground mt-1">Email cannot be changed</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Phone Number</label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={profileData.phoneNumber}
                    onChange={handleInputChange}
                    placeholder="Enter phone number"
                    className="w-full px-4 py-3 rounded-xl border-2 border-border bg-background text-foreground focus:border-primary focus:outline-none"
                  />
                ) : (
                  <div className="px-4 py-3 rounded-xl bg-muted text-foreground">{profileData.phoneNumber || 'Not set'}</div>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Date of Birth</label>
                {isEditing ? (
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={profileData.dateOfBirth}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-border bg-background text-foreground focus:border-primary focus:outline-none"
                  />
                ) : (
                  <div className="px-4 py-3 rounded-xl bg-muted text-foreground">
                    {profileData.dateOfBirth ? new Date(profileData.dateOfBirth).toLocaleDateString() : 'Not set'}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Address</label>
                {isEditing ? (
                  <textarea
                    name="address"
                    value={profileData.address}
                    onChange={handleInputChange}
                    placeholder="Enter your address"
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border-2 border-border bg-background text-foreground focus:border-primary focus:outline-none resize-none"
                  />
                ) : (
                  <div className="px-4 py-3 rounded-xl bg-muted text-foreground min-h-[3rem]">
                    {profileData.address || 'Not set'}
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex-1 py-3 bg-primary text-primary-foreground rounded-xl font-bold hover:bg-primary/90 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <Save className="w-5 h-5" />
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={isSaving}
                    className="flex-1 py-3 bg-muted text-muted-foreground rounded-xl font-semibold hover:bg-muted/80 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <X className="w-5 h-5" />
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-bold hover:bg-primary/90 flex items-center justify-center gap-2"
                >
                  <Edit2 className="w-5 h-5" />
                  Edit Profile
                </button>
              )}
            </div>
          </section>

          <section className="space-y-4">
            <div className="rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-800/60 p-5 shadow-xl">
              <p className="text-xs text-muted-foreground uppercase tracking-widest mb-2">Next visit</p>
              <h3 className="text-xl font-bold text-foreground mb-3">{nextVisit.doctor}</h3>
              <p className="text-sm text-muted-foreground">{nextVisit.mode}</p>
              <div className="flex items-center gap-3 mt-4 text-sm font-semibold text-foreground">
                <span className="px-3 py-1 rounded-full bg-primary/10 text-primary">{nextVisit.date}</span>
                <span className="px-3 py-1 rounded-full bg-primary/10 text-primary">{nextVisit.time}</span>
              </div>
              <button className="mt-4 w-full py-2.5 rounded-xl border border-primary/40 text-primary font-semibold hover:bg-primary/10 transition-colors">
                Manage Appointment
              </button>
            </div>

            <div className="rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-800/60 p-5 shadow-xl space-y-3">
              <p className="text-xs text-muted-foreground uppercase tracking-widest">Wellness insights</p>
              {wellnessInsights.map((insight) => (
                <div
                  key={insight.title}
                  className="p-3 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 bg-gradient-to-r from-slate-50/70 to-white/40 dark:from-slate-900/50 dark:to-slate-900/30"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-foreground">{insight.title}</p>
                    <span className="text-xs font-bold text-primary">{insight.status}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{insight.detail}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <section className="rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-800/60 p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-widest">Care timeline</p>
              <h3 className="text-xl font-bold text-foreground">Recent Activity</h3>
            </div>
            <button className="px-4 py-2 rounded-full border border-slate-200/60 dark:border-slate-800/60 text-sm font-semibold">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {careTimeline.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 bg-slate-50/60 dark:bg-slate-900/40"
              >
                <div>
                  <p className="text-sm font-semibold text-foreground">{item.title}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
                <div className="flex items-center gap-3 text-xs font-semibold text-muted-foreground">
                  <span className="px-3 py-1 rounded-full bg-primary/10 text-primary">{item.status}</span>
                  <span>{item.date}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}







