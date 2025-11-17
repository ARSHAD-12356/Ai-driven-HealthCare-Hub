import { useState, useEffect } from 'react';
import { Search, MessageCircle, Phone, Star, Home, User, LogOut, AlertCircle, Plus, Clock, Pill, Calendar, Syringe, X, Moon, Sun } from 'lucide-react';
import ChatInterface from '../chat/chat-interface';
import SymptomChecker from '../symptom-checker/symptom-checker';
import RemoteConsultation from '../consultation/remote-consultation';
import HealthRecords from '../health-records/health-records';
import PatientFeedback from '../feedback/patient-feedback';
import PatientProfile from '../profile/patient-profile';

interface PatientDashboardProps {
  onLogout: () => void;
}

interface Reminder {
  id: string;
  title: string;
  description: string;
  time: string;
  category: 'medicine' | 'vaccination' | 'checkup' | 'custom';
  isActive: boolean;
}

export default function PatientDashboard({ onLogout }: PatientDashboardProps) {
  const [activeTab, setActiveTab] = useState<'home' | 'chat' | 'symptoms' | 'consultation' | 'records' | 'feedback' | 'profile'>('home');
  const [darkMode, setDarkMode] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [profileName, setProfileName] = useState('Patient');

  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setDarkMode(isDark);
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    if (newMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const loadProfileSummary = () => {
    const storedUser = typeof window !== 'undefined' ? localStorage.getItem('currentUser') : null;
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser) as { fullName?: string; email?: string };
        setProfileName(user.fullName || 'Patient');
        if (user.email) {
          const savedPic = localStorage.getItem(`profilePic_${user.email}`);
          setProfilePic(savedPic || null);
        }
      } catch (error) {
        console.error('Failed to parse user', error);
      }
    }
  };

  useEffect(() => {
    loadProfileSummary();
  }, []);

  useEffect(() => {
    const handleProfileUpdate = () => loadProfileSummary();
    window.addEventListener('patient-profile-updated', handleProfileUpdate);
    return () => window.removeEventListener('patient-profile-updated', handleProfileUpdate);
  }, []);

  useEffect(() => {
    loadProfileSummary();
  }, [activeTab]);

  const healthImages = [
    {
      url: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&w=1600&q=90',
      title: 'Your Health, Our Priority',
      desc: 'Access quality healthcare services anytime, anywhere.',
    },
    {
      url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?auto=format&fit=crop&w=1600&q=90',
      title: 'AI-Powered Diagnosis',
      desc: 'Get instant health insights with advanced AI technology.',
    },
    {
      url: 'https://images.unsplash.com/photo-1551601651-2a8555f1a136?auto=format&fit=crop&w=1600&q=90',
      title: 'Remote Consultations',
      desc: 'Connect with healthcare professionals from anywhere.',
    },
    {
      url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1600&q=90',
      title: 'Comprehensive Care',
      desc: 'Complete health management at your fingertips.',
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % healthImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);
  const [reminders, setReminders] = useState<Reminder[]>([
    {
      id: '1',
      title: '💉 Vaccination Due',
      description: 'COVID-19 booster due this week',
      time: '',
      category: 'vaccination',
      isActive: true,
    },
    {
      id: '2',
      title: '💊 Medicine Reminder',
      description: 'Take your blood pressure medication at 9 AM',
      time: '09:00',
      category: 'medicine',
      isActive: true,
    },
    {
      id: '3',
      title: '👶 Pregnancy Checkup',
      description: 'Regular checkup scheduled for next Monday',
      time: '',
      category: 'checkup',
      isActive: true,
    },
  ]);
  const [showAddReminder, setShowAddReminder] = useState(false);
  const [newReminder, setNewReminder] = useState({
    title: '',
    description: '',
    time: '',
    category: 'custom' as const,
  });

  const handleAddReminder = () => {
    if (newReminder.title.trim()) {
      const reminder: Reminder = {
        id: Date.now().toString(),
        title: newReminder.title,
        description: newReminder.description,
        time: newReminder.time,
        category: newReminder.category,
        isActive: true,
      };
      setReminders([...reminders, reminder]);
      setNewReminder({
        title: '',
        description: '',
        time: '',
        category: 'custom',
      });
      setShowAddReminder(false);
    }
  };

  const handleRemoveReminder = (id: string) => {
    setReminders(reminders.filter((r) => r.id !== id));
  };

  const handleToggleReminder = (id: string) => {
    setReminders(
      reminders.map((r) =>
        r.id === id ? { ...r, isActive: !r.isActive } : r
      )
    );
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50/30 to-purple-50/20 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-linear-to-r from-primary via-accent to-secondary rounded-2xl blur-lg opacity-30"></div>
              <div className="relative w-14 h-14 bg-linear-to-br from-primary via-accent to-secondary rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-2xl">🏥</span>
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-extrabold bg-clip-text text-transparent bg-linear-to-r from-primary via-accent to-secondary">
                HealthCare Hub
              </h1>
              <p className="text-xs text-muted-foreground font-medium">Your Personal Health Manager</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={toggleDarkMode}
              className="p-2.5 text-muted-foreground hover:text-foreground hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl transition-all"
              title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className="flex items-center gap-3 px-4 py-2.5 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 bg-white/60 dark:bg-slate-900/60 hover:border-primary/60 transition-all"
            >
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary/30 bg-linear-to-br from-primary/30 to-accent/30 flex items-center justify-center text-sm font-bold text-primary">
                {profilePic ? (
                  <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  profileName
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .slice(0, 2)
                    .toUpperCase()
                )}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs text-muted-foreground">My Profile</p>
                <p className="text-sm font-semibold text-foreground">{profileName.split(' ')[0] || 'You'}</p>
              </div>
            </button>
            <button
              onClick={onLogout}
              className="px-5 py-2.5 text-sm font-semibold text-destructive bg-destructive/10 hover:bg-destructive/20 rounded-xl transition-all flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto p-4 pb-28 relative z-10">
        {activeTab === 'home' && (
          <div className="space-y-6">
            {/* Welcome Section with Carousel */}
            <div className="mb-6 relative h-72 rounded-3xl overflow-hidden shadow-2xl group border-2 border-slate-200/50 dark:border-slate-800/50">
              <div className="absolute inset-0">
                {healthImages.map((img, idx) => (
                  <div
                    key={idx}
                    className={`absolute inset-0 transition-opacity duration-1000 ${
                      idx === carouselIndex ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    <img
                      src={img.url}
                      alt={img.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&w=1600&q=90';
                      }}
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/50 to-black/20"></div>
                  </div>
                ))}
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white z-10">
                <h3 className="text-3xl font-extrabold mb-2 drop-shadow-lg">{healthImages[carouselIndex]?.title}</h3>
                <p className="text-base opacity-95 font-medium drop-shadow-md">{healthImages[carouselIndex]?.desc}</p>
              </div>
              {/* Carousel Indicators */}
              <div className="absolute top-4 right-4 flex gap-2 z-10 bg-black/30 backdrop-blur-sm px-3 py-2 rounded-full">
                {healthImages.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCarouselIndex(idx)}
                    className={`h-2 rounded-full transition-all ${
                      idx === carouselIndex ? 'bg-white w-8' : 'bg-white/50 w-2'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Emergency SOS */}
            <div className="mb-6">
              <button 
                onClick={() => window.open('tel:108', '_self')}
                className="group relative w-full py-6 px-6 bg-linear-to-r from-red-600 via-red-500 to-red-600 text-white rounded-3xl font-bold text-xl hover:shadow-2xl hover:shadow-red-500/50 active:scale-[0.98] transition-all shadow-xl overflow-hidden"
              >
                <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                <div className="relative flex items-center justify-center gap-3">
                  <AlertCircle className="w-6 h-6 animate-pulse" />
                  <span>EMERGENCY - CALL 108</span>
                  <AlertCircle className="w-6 h-6 animate-pulse" />
                </div>
              </button>
            </div>

            {/* Welcome Message */}
            <div className="mb-6 bg-gradient-to-r from-primary/10 via-accent/10 to-secondary/10 border border-primary/20 rounded-3xl p-6 text-center shadow-lg">
              <p className="text-2xl font-extrabold text-foreground mb-2">
                👋 Welcome back, {profileName.split(' ')[0] || 'Patient'}!
              </p>
              <p className="text-sm text-muted-foreground">
                Your health is our priority. Explore our services below.
              </p>
            </div>

            {/* Quick Actions */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="h-1 w-12 bg-linear-to-r from-primary to-accent rounded-full"></div>
                <h2 className="text-3xl font-extrabold text-foreground">Quick Actions</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                <button
                  onClick={() => setActiveTab('symptoms')}
                  className="group relative p-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-2 border-slate-200/50 dark:border-slate-800/50 rounded-3xl hover:border-primary/50 dark:hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 active:scale-[0.98] overflow-hidden"
                >
                  <div className="absolute inset-0 bg-linear-to-br from-primary/0 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative">
                    <div className="w-14 h-14 bg-linear-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-lg">
                      <Search className="w-7 h-7 text-white" />
                    </div>
                    <div className="font-bold text-lg text-foreground mb-1">Check Symptoms</div>
                    <p className="text-xs text-muted-foreground">AI diagnosis</p>
                  </div>
                </button>

                <button
                  onClick={() => setActiveTab('chat')}
                  className="group relative p-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-2 border-slate-200/50 dark:border-slate-800/50 rounded-3xl hover:border-accent/50 dark:hover:border-accent/50 hover:shadow-2xl hover:shadow-accent/10 transition-all duration-300 active:scale-[0.98] overflow-hidden"
                >
                  <div className="absolute inset-0 bg-linear-to-br from-accent/0 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative">
                    <div className="w-14 h-14 bg-linear-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-lg">
                      <MessageCircle className="w-7 h-7 text-white" />
                    </div>
                    <div className="font-bold text-lg text-foreground mb-1">AI Assistant</div>
                    <p className="text-xs text-muted-foreground">Get guidance</p>
                  </div>
                </button>

                <button
                  onClick={() => setActiveTab('consultation')}
                  className="group relative p-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-2 border-slate-200/50 dark:border-slate-800/50 rounded-3xl hover:border-secondary/50 dark:hover:border-secondary/50 hover:shadow-2xl hover:shadow-secondary/10 transition-all duration-300 active:scale-[0.98] overflow-hidden"
                >
                  <div className="absolute inset-0 bg-linear-to-br from-secondary/0 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative">
                    <div className="w-14 h-14 bg-linear-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-lg">
                      <Phone className="w-7 h-7 text-white" />
                    </div>
                    <div className="font-bold text-lg text-foreground mb-1">Consultation</div>
                    <p className="text-xs text-muted-foreground">Talk to doctor</p>
                  </div>
                </button>

                <button
                  onClick={() => setActiveTab('feedback')}
                  className="group relative p-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-2 border-slate-200/50 dark:border-slate-800/50 rounded-3xl hover:border-yellow-500/50 dark:hover:border-yellow-500/50 hover:shadow-2xl hover:shadow-yellow-500/10 transition-all duration-300 active:scale-[0.98] overflow-hidden"
                >
                  <div className="absolute inset-0 bg-linear-to-br from-yellow-500/0 to-yellow-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative">
                    <div className="w-14 h-14 bg-linear-to-br from-yellow-500 to-yellow-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-lg">
                      <Star className="w-7 h-7 text-white" fill="currentColor" />
                    </div>
                    <div className="font-bold text-lg text-foreground mb-1">Feedback</div>
                    <p className="text-xs text-muted-foreground">Share thoughts</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Reminders Section */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-1 w-12 bg-linear-to-r from-accent to-secondary rounded-full"></div>
                  <h2 className="text-3xl font-extrabold text-foreground">Your Health Reminders</h2>
                </div>
                <button
                  onClick={() => setShowAddReminder(!showAddReminder)}
                  className="px-5 py-2.5 bg-linear-to-r from-primary via-accent to-secondary text-white rounded-xl text-sm font-bold hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Reminder
                </button>
              </div>

              {showAddReminder && (
                <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-2 border-primary/20 rounded-3xl p-6 space-y-4 shadow-xl">
                  <input
                    type="text"
                    value={newReminder.title}
                    onChange={(e) =>
                      setNewReminder({ ...newReminder, title: e.target.value })
                    }
                    placeholder="Reminder title (e.g., Take Medicine)"
                    className="w-full px-5 py-3.5 rounded-xl bg-background/50 border-2 border-slate-200/50 dark:border-slate-800/50 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                  <input
                    type="text"
                    value={newReminder.description}
                    onChange={(e) =>
                      setNewReminder({ ...newReminder, description: e.target.value })
                    }
                    placeholder="Description (optional)"
                    className="w-full px-5 py-3.5 rounded-xl bg-background/50 border-2 border-slate-200/50 dark:border-slate-800/50 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="time"
                      value={newReminder.time}
                      onChange={(e) =>
                        setNewReminder({ ...newReminder, time: e.target.value })
                      }
                      className="px-5 py-3.5 rounded-xl bg-background/50 border-2 border-slate-200/50 dark:border-slate-800/50 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                    <select
                      value={newReminder.category}
                      onChange={(e) =>
                        setNewReminder({ ...newReminder, category: e.target.value as any })
                      }
                      className="px-5 py-3.5 rounded-xl bg-background/50 border-2 border-slate-200/50 dark:border-slate-800/50 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    >
                      <option value="medicine">Medicine</option>
                      <option value="vaccination">Vaccination</option>
                      <option value="checkup">Checkup</option>
                      <option value="custom">Custom</option>
                    </select>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={handleAddReminder}
                      disabled={!newReminder.title.trim()}
                      className="flex-1 py-3.5 bg-linear-to-r from-primary via-accent to-secondary text-white rounded-xl font-bold hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      Save Reminder
                    </button>
                    <button
                      onClick={() => setShowAddReminder(false)}
                      className="flex-1 py-3.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                {reminders.length === 0 ? (
                  <div className="text-center py-12 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl rounded-3xl border-2 border-dashed border-slate-300 dark:border-slate-700">
                    <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                    <p className="text-muted-foreground font-medium">
                      No reminders yet. Click Add Reminder to create one!
                    </p>
                  </div>
                ) : (
                  reminders.map((reminder) => {
                    const categoryConfig = {
                      medicine: {
                        bg: 'from-emerald-500/10 to-emerald-600/10',
                        border: 'border-emerald-500',
                        icon: Pill,
                        iconColor: 'text-emerald-600',
                      },
                      vaccination: {
                        bg: 'from-blue-500/10 to-blue-600/10',
                        border: 'border-blue-500',
                        icon: Syringe,
                        iconColor: 'text-blue-600',
                      },
                      checkup: {
                        bg: 'from-purple-500/10 to-purple-600/10',
                        border: 'border-purple-500',
                        icon: Calendar,
                        iconColor: 'text-purple-600',
                      },
                      custom: {
                        bg: 'from-slate-500/10 to-slate-600/10',
                        border: 'border-slate-500',
                        icon: Clock,
                        iconColor: 'text-slate-600',
                      },
                    } as const;
                    const config = categoryConfig[reminder.category];
                    const IconComponent = config.icon;

                    return (
                      <div
                        key={reminder.id}
                        className={`group relative p-5 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-l-4 ${config.border} rounded-2xl transition-all hover:shadow-xl ${
                          reminder.isActive ? '' : 'opacity-60'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-4 flex-1">
                            <div className={`w-12 h-12 bg-linear-to-br ${config.bg} rounded-xl flex items-center justify-center shrink-0`}>
                              <IconComponent className={`w-6 h-6 ${config.iconColor}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-bold text-foreground text-lg mb-1">{reminder.title}</div>
                              <p className="text-sm text-muted-foreground mb-2">{reminder.description}</p>
                              {reminder.time ? (
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <Clock className="w-3 h-3" />
                                  <span>{reminder.time}</span>
                                </div>
                              ) : null}
                            </div>
                          </div>
                          <div className="flex gap-2 shrink-0">
                            <button
                              type="button"
                              onClick={() => handleToggleReminder(reminder.id)}
                              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                                reminder.isActive
                                  ? 'bg-primary text-white hover:bg-primary/90 shadow-lg'
                                  : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-300 dark:hover:bg-slate-700'
                              }`}
                            >
                              {reminder.isActive ? 'Active' : 'Inactive'}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveReminder(reminder.id)}
                              className="p-2 text-destructive hover:bg-destructive/10 rounded-xl transition-all"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'chat' && <ChatInterface onBack={() => setActiveTab('home')} />}
        {activeTab === 'symptoms' && (
          <SymptomChecker
            onBack={() => setActiveTab('home')}
            onTalkWithAI={() => setActiveTab('chat')}
            onConsultDoctor={() => setActiveTab('consultation')}
          />
        )}
        {activeTab === 'consultation' && <RemoteConsultation />}
        {activeTab === 'records' && <HealthRecords />}
        {activeTab === 'feedback' && <PatientFeedback onBack={() => setActiveTab('home')} />}
        {activeTab === 'profile' && <PatientProfile onBack={() => setActiveTab('home')} />}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-t border-slate-200/50 dark:border-slate-800/50 shadow-2xl z-50">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-around">
          {[
            { id: 'home' as const, icon: Home, label: 'Home' },
            { id: 'chat' as const, icon: MessageCircle, label: 'Chat' },
            { id: 'symptoms' as const, icon: Search, label: 'Check' },
            { id: 'consultation' as const, icon: Phone, label: 'Doctor' },
            { id: 'feedback' as const, icon: Star, label: 'Feedback' },
            { id: 'profile' as const, icon: User, label: 'Profile', isProfile: true },
          ].map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex-1 flex flex-col items-center justify-center py-4 gap-1.5 font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {activeTab === tab.id && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-linear-to-r from-primary to-accent rounded-b-full"></div>
                )}
                <div
                  className={`p-2 rounded-xl transition-all ${
                    activeTab === tab.id ? 'bg-primary/10 scale-110' : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {tab.isProfile && profilePic ? (
                    <img src={profilePic} alt="Profile" className="w-6 h-6 rounded-full object-cover" />
                  ) : (
                    <IconComponent className={`w-5 h-5 ${activeTab === tab.id ? 'text-primary' : ''}`} />
                  )}
                </div>
                <span className="text-xs">{tab.label}</span>
              </button>
            );
          })}
        </div>
        <div className="text-center py-2.5 text-xs text-muted-foreground border-t border-slate-200/50 dark:border-slate-800/50">
          Developed by ArshXCoder
        </div>
      </nav>
    </div>
  );
}
