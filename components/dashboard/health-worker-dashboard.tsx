import { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';

type WorkerTab = 'home' | 'add-visit' | 'triage' | 'pending' | 'patients';

interface PatientVisit {
  id: string;
  patientName: string;
  date: string;
  symptoms: string[];
  vitals: { bp: string; temp: string; pulse: string };
  status: 'pending' | 'synced';
  customDescription?: string;
}

export default function HealthWorkerDashboard({ onLogout }: { onLogout: () => void }) {
  const [activeTab, setActiveTab] = useState<WorkerTab>('home');
  const [darkMode, setDarkMode] = useState(false);

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
  const [visits, setVisits] = useState<PatientVisit[]>([
    {
      id: '1',
      patientName: 'Ramesh Singh',
      date: 'Dec 12, 2024',
      symptoms: ['Fever', 'Cough'],
      vitals: { bp: '120/80', temp: '38.5°C', pulse: '88' },
      status: 'pending',
      customDescription: 'Patient has been experiencing symptoms for 3 days. Lives in rural area, limited access to transportation. Recommended home isolation and monitoring.',
    },
    {
      id: '2',
      patientName: 'Lakshmi Devi',
      date: 'Dec 11, 2024',
      symptoms: ['Headache', 'Fatigue'],
      vitals: { bp: '118/76', temp: '37°C', pulse: '72' },
      status: 'synced',
      customDescription: 'Patient is pregnant (6 months). Experiencing normal pregnancy symptoms. Advised prenatal vitamins and rest.',
    },
  ]);

  const [newVisit, setNewVisit] = useState({
    patientName: '',
    symptoms: [] as string[],
    bp: '',
    temp: '',
    pulse: '',
    customDescription: '',
  });

  const [editingPatientId, setEditingPatientId] = useState<string | null>(null);
  const [editDescription, setEditDescription] = useState('');

  const symptoms = [
    'Fever',
    'Cough',
    'Runny Nose',
    'Headache',
    'Fatigue',
    'Nausea',
    'Chest Pain',
    'Difficulty Breathing',
  ];

  const handleAddVisit = () => {
    if (!newVisit.patientName || newVisit.symptoms.length === 0) {
      alert('Please fill in all required fields');
      return;
    }

    const visit: PatientVisit = {
      id: Date.now().toString(),
      patientName: newVisit.patientName,
      date: new Date().toLocaleDateString(),
      symptoms: newVisit.symptoms,
      vitals: {
        bp: newVisit.bp || 'N/A',
        temp: newVisit.temp || 'N/A',
        pulse: newVisit.pulse || 'N/A',
      },
      status: 'pending',
      customDescription: newVisit.customDescription,
    };

    setVisits([visit, ...visits]);
    setNewVisit({ patientName: '', symptoms: [], bp: '', temp: '', pulse: '', customDescription: '' });
    setActiveTab('pending');
  };

  const handleSyncData = () => {
    setVisits(
      visits.map((v) => ({ ...v, status: 'synced' }))
    );
  };

  const handleUpdateDescription = (patientId: string) => {
    setVisits(
      visits.map((v) =>
        v.id === patientId
          ? { ...v, customDescription: editDescription }
          : v
      )
    );
    setEditingPatientId(null);
    setEditDescription('');
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">👨‍⚕️</span>
            <h1 className="text-xl font-bold text-foreground">Health Worker Hub</h1>
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
              onClick={onLogout}
              className="px-4 py-2 text-sm font-semibold text-destructive bg-destructive/10 hover:bg-destructive/20 rounded-xl transition-all"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 pb-24">
        {activeTab === 'home' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-card border-2 border-border rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Today's Visits</p>
                <p className="text-3xl font-bold text-primary">12</p>
              </div>
              <div className="p-4 bg-card border-2 border-border rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Pending Sync</p>
                <p className="text-3xl font-bold text-accent">3</p>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => setActiveTab('add-visit')}
                className="w-full p-6 bg-primary text-primary-foreground rounded-lg font-bold text-lg hover:bg-primary/90 active:scale-95"
              >
                Add New Patient Visit
              </button>

              <button
                onClick={() => setActiveTab('triage')}
                className="w-full p-6 bg-secondary text-secondary-foreground rounded-lg font-bold text-lg hover:bg-secondary/90 active:scale-95"
              >
                AI-Assisted Triage
              </button>

              <button
                onClick={() => setActiveTab('pending')}
                className="w-full p-6 bg-accent text-accent-foreground rounded-lg font-bold text-lg hover:bg-accent/90 active:scale-95"
              >
                View Pending Cases ({visits.filter(v => v.status === 'pending').length})
              </button>

              <button
                onClick={() => setActiveTab('patients')}
                className="w-full p-6 bg-secondary text-secondary-foreground rounded-lg font-bold text-lg hover:bg-secondary/90 active:scale-95"
              >
                View All Patients
              </button>

              <button
                onClick={handleSyncData}
                className="w-full p-6 bg-card border-2 border-primary text-primary rounded-lg font-bold text-lg hover:bg-primary/10 active:scale-95"
              >
                Sync All Data
              </button>
            </div>

            <div>
              <h2 className="text-lg font-bold text-foreground mb-3">Recent Visits</h2>
              <div className="space-y-2">
                {visits.slice(0, 3).map((v) => (
                  <div key={v.id} className="p-3 bg-card border border-border rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-bold text-foreground">{v.patientName}</p>
                      <span className={`text-xs font-bold px-2 py-1 rounded ${
                        v.status === 'synced'
                          ? 'bg-secondary text-secondary-foreground'
                          : 'bg-accent text-accent-foreground'
                      }`}>
                        {v.status === 'synced' ? 'Synced' : 'Pending'}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">{v.date}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'add-visit' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-foreground mb-4">Add New Patient Visit</h2>

            <div>
              <label className="block text-sm font-bold text-foreground mb-2">
                Patient Name
              </label>
              <input
                type="text"
                value={newVisit.patientName}
                onChange={(e) => setNewVisit({ ...newVisit, patientName: e.target.value })}
                placeholder="Enter patient name"
                className="w-full px-4 py-3 rounded-lg border-2 border-border bg-card text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-foreground mb-2">
                Select Symptoms
              </label>
              <div className="grid grid-cols-2 gap-2">
                {symptoms.map((sym) => (
                  <button
                    key={sym}
                    onClick={() =>
                      setNewVisit({
                        ...newVisit,
                        symptoms: newVisit.symptoms.includes(sym)
                          ? newVisit.symptoms.filter((s) => s !== sym)
                          : [...newVisit.symptoms, sym],
                      })
                    }
                    className={`p-2 rounded-lg font-semibold text-sm transition-all ${
                      newVisit.symptoms.includes(sym)
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-card border-2 border-border text-foreground hover:border-primary'
                    }`}
                  >
                    {sym}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-foreground mb-2">BP</label>
                <input
                  type="text"
                  value={newVisit.bp}
                  onChange={(e) => setNewVisit({ ...newVisit, bp: e.target.value })}
                  placeholder="120/80"
                  className="w-full px-3 py-2 rounded-lg border-2 border-border bg-card text-foreground text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-foreground mb-2">Temp</label>
                <input
                  type="text"
                  value={newVisit.temp}
                  onChange={(e) => setNewVisit({ ...newVisit, temp: e.target.value })}
                  placeholder="37°C"
                  className="w-full px-3 py-2 rounded-lg border-2 border-border bg-card text-foreground text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-foreground mb-2">Pulse</label>
                <input
                  type="text"
                  value={newVisit.pulse}
                  onChange={(e) => setNewVisit({ ...newVisit, pulse: e.target.value })}
                  placeholder="72"
                  className="w-full px-3 py-2 rounded-lg border-2 border-border bg-card text-foreground text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-foreground mb-2">
                Custom Patient Description
              </label>
              <textarea
                value={newVisit.customDescription}
                onChange={(e) => setNewVisit({ ...newVisit, customDescription: e.target.value })}
                placeholder="Add detailed information about the patient (medical history, living conditions, special needs, etc.)"
                className="w-full px-4 py-3 rounded-lg border-2 border-border bg-card text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none resize-none"
                rows={4}
              />
            </div>

            <button
              onClick={handleAddVisit}
              className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-bold hover:bg-primary/90"
            >
              Save Visit
            </button>
          </div>
        )}

        {activeTab === 'triage' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-foreground mb-4">AI-Assisted Triage</h2>

            <div className="p-6 bg-card border-2 border-border rounded-lg space-y-4">
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm font-bold text-foreground mb-2">Patient: Ramesh Singh</p>
                <p className="text-sm text-muted-foreground">
                  Age: 42 | Gender: Male | BP: 120/80 | Temp: 38.5°C
                </p>
              </div>

              <div className="bg-primary/10 border-l-4 border-primary p-4 rounded-lg">
                <p className="font-bold text-foreground mb-2">AI Triage Assessment:</p>
                <p className="text-sm text-foreground mb-3">
                  Based on symptoms (Fever, Cough) and vitals, this patient likely has Upper Respiratory Infection.
                </p>
                <div className="space-y-2">
                  <p className="text-xs font-bold text-primary">Urgency: MEDIUM</p>
                  <p className="text-xs text-foreground">
                    Recommend: Monitor vitals, prescribe symptomatic treatment, follow-up in 3 days
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-foreground mb-2">
                  Add Your Notes
                </label>
                <textarea
                  placeholder="Add clinical notes..."
                  className="w-full px-4 py-3 rounded-lg border-2 border-border bg-background text-foreground text-sm resize-none"
                  rows={4}
                />
              </div>

              <button className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-bold hover:bg-primary/90">
                Save Triage Assessment
              </button>
            </div>
          </div>
        )}

        {activeTab === 'pending' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-foreground mb-4">Pending Cases</h2>

            {visits
              .filter((v) => v.status === 'pending')
              .map((v) => (
                <div key={v.id} className="p-4 bg-card border-2 border-border rounded-lg space-y-3">
                  <h3 className="font-bold text-foreground text-lg">{v.patientName}</h3>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div className="bg-muted p-2 rounded">
                      <p className="text-xs text-muted-foreground">BP</p>
                      <p className="font-bold text-foreground">{v.vitals.bp}</p>
                    </div>
                    <div className="bg-muted p-2 rounded">
                      <p className="text-xs text-muted-foreground">Temp</p>
                      <p className="font-bold text-foreground">{v.vitals.temp}</p>
                    </div>
                    <div className="bg-muted p-2 rounded">
                      <p className="text-xs text-muted-foreground">Pulse</p>
                      <p className="font-bold text-foreground">{v.vitals.pulse}</p>
                    </div>
                  </div>
                  <p className="text-sm text-foreground">Symptoms: {v.symptoms.join(', ')}</p>

                  {v.customDescription && (
                    <div className="bg-accent/10 border-l-4 border-accent p-3 rounded">
                      <p className="text-xs font-bold text-accent mb-1">Patient Details:</p>
                      <p className="text-sm text-foreground">{v.customDescription}</p>
                    </div>
                  )}

                  <button className="w-full py-2 bg-primary text-primary-foreground rounded-lg text-sm font-bold hover:bg-primary/90">
                    Sync This Record
                  </button>
                </div>
              ))}
          </div>
        )}

        {activeTab === 'patients' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-foreground mb-4">All Patients</h2>

            {editingPatientId ? (
              <div className="p-6 bg-card border-2 border-border rounded-lg space-y-4">
                <h3 className="text-lg font-bold text-foreground">
                  Edit Patient Description
                </h3>
                <div>
                  <label className="block text-sm font-bold text-foreground mb-2">
                    Patient Details
                  </label>
                  <textarea
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    placeholder="Add or edit patient details..."
                    className="w-full px-4 py-3 rounded-lg border-2 border-border bg-background text-foreground resize-none"
                    rows={5}
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleUpdateDescription(editingPatientId)}
                    className="flex-1 py-2 bg-primary text-primary-foreground rounded-lg font-bold hover:bg-primary/90"
                  >
                    Save Description
                  </button>
                  <button
                    onClick={() => {
                      setEditingPatientId(null);
                      setEditDescription('');
                    }}
                    className="flex-1 py-2 bg-muted text-muted-foreground rounded-lg font-bold hover:bg-muted/80"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {visits.map((patient) => (
                  <div key={patient.id} className="p-4 bg-card border-2 border-border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-bold text-foreground text-lg">{patient.patientName}</h4>
                        <p className="text-xs text-muted-foreground">{patient.date}</p>
                      </div>
                      <span className={`text-xs font-bold px-2 py-1 rounded ${
                        patient.status === 'synced'
                          ? 'bg-secondary text-secondary-foreground'
                          : 'bg-accent text-accent-foreground'
                      }`}>
                        {patient.status === 'synced' ? 'Synced' : 'Pending'}
                      </span>
                    </div>

                    <p className="text-sm text-muted-foreground mb-2">
                      Symptoms: {patient.symptoms.join(', ')}
                    </p>

                    <div className="bg-muted p-3 rounded mb-3">
                      <p className="text-xs font-bold text-foreground mb-1">Patient Details:</p>
                      {patient.customDescription ? (
                        <p className="text-sm text-foreground">{patient.customDescription}</p>
                      ) : (
                        <p className="text-sm text-muted-foreground italic">No description added</p>
                      )}
                    </div>

                    <button
                      onClick={() => {
                        setEditingPatientId(patient.id);
                        setEditDescription(patient.customDescription || '');
                      }}
                      className="w-full py-2 bg-primary text-primary-foreground rounded-lg text-sm font-bold hover:bg-primary/90"
                    >
                      Edit Description
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
        <div className="max-w-4xl mx-auto px-4 flex items-center justify-around">
          {[
            { id: 'home' as const, icon: '🏠', label: 'Home' },
            { id: 'add-visit' as const, icon: '➕', label: 'Add' },
            { id: 'triage' as const, icon: '📊', label: 'Triage' },
            { id: 'pending' as const, icon: '📋', label: 'Pending' },
            { id: 'patients' as const, icon: '👥', label: 'Patients' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex flex-col items-center justify-center py-4 gap-1 font-semibold transition-colors ${
                activeTab === tab.id
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <span className="text-2xl">{tab.icon}</span>
              <span className="text-xs">{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
