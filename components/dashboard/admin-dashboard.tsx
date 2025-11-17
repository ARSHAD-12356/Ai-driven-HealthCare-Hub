import { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';

type AdminTab = 'overview' | 'villages' | 'alerts' | 'workers' | 'analytics' | 'approvals';

interface VillageData {
  id: string;
  name: string;
  population: number;
  coverage: number;
  activeWorkers: number;
  activeCases: number;
  closedCases: number;
}

interface AlertData {
  id: string;
  type: 'warning' | 'critical';
  title: string;
  description: string;
  village: string;
  timestamp: string;
}

interface PendingWorker {
  _id?: string;
  id?: string; // For backward compatibility
  fullName: string;
  phoneNumber: string;
  email: string;
  qualification: string;
  registrationNumber: string;
  yearOfRegistration?: string;
  stateMedicalCouncil?: string;
  hospitalClinicName: string;
  district: string;
  village: string;
  yearsOfExperience: string;
  specializedStream: string;
  governmentIdFileName: string;
  proofFileName: string;
  appliedDate: string | Date;
  status: 'pending' | 'approved' | 'denied';
  denialReason?: string;
}

export default function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
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

  const [villages, setVillages] = useState<VillageData[]>([
    {
      id: '1',
      name: 'Ashpur',
      population: 2840,
      coverage: 85,
      activeWorkers: 3,
      activeCases: 12,
      closedCases: 45,
    },
    {
      id: '2',
      name: 'Devpur',
      population: 3120,
      coverage: 72,
      activeWorkers: 2,
      activeCases: 18,
      closedCases: 52,
    },
    {
      id: '3',
      name: 'Gajpur',
      population: 1950,
      coverage: 91,
      activeWorkers: 2,
      activeCases: 5,
      closedCases: 28,
    },
    {
      id: '4',
      name: 'Harmpur',
      population: 2650,
      coverage: 68,
      activeWorkers: 2,
      activeCases: 24,
      closedCases: 61,
    },
  ]);

  const [carouselIndex, setCarouselIndex] = useState(0);

  const [editingVillage, setEditingVillage] = useState<VillageData | null>(null);
  const [editForm, setEditForm] = useState<VillageData | null>(null);
  const [showAddVillage, setShowAddVillage] = useState(false);

  // Load pending workers from MongoDB
  const loadPendingWorkers = async (): Promise<PendingWorker[]> => {
    try {
      const response = await fetch('/api/auth/health-workers?status=pending');
      if (response.ok) {
        const data = await response.json();
        return data.healthWorkers || [];
      }
    } catch (error) {
      console.error('Error loading pending workers:', error);
    }
    return [];
  };

  const [pendingWorkersList, setPendingWorkersList] = useState<PendingWorker[]>([]);
  const [selectedWorker, setSelectedWorker] = useState<PendingWorker | null>(null);
  const [denialReason, setDenialReason] = useState('');
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [isExportingData, setIsExportingData] = useState(false);
  const [reportError, setReportError] = useState<string | null>(null);
  const [exportError, setExportError] = useState<string | null>(null);

  // Refresh pending workers list when approvals tab is active
  useEffect(() => {
    if (activeTab === 'approvals') {
      loadPendingWorkers().then(setPendingWorkersList);
      // Auto-refresh every 5 seconds when on approvals tab
      const interval = setInterval(() => {
        loadPendingWorkers().then(setPendingWorkersList);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [activeTab]);

  const alerts: AlertData[] = [
    {
      id: '1',
      type: 'critical',
      title: 'High Fever Cases Detected',
      description: 'Cluster of fever cases reported in Harmpur',
      village: 'Harmpur',
      timestamp: '2 hours ago',
    },
  ];

  const workers = [
    { name: 'Rajesh Kumar', village: 'Ashpur', status: 'online', cases: 42 },
    { name: 'Priya Singh', village: 'Devpur', status: 'online', cases: 38 },
    { name: 'Amit Patel', village: 'Gajpur', status: 'offline', cases: 31 },
  ];

  const stats = [
    { label: 'Total Patients', value: '12,450', change: '+5%', icon: '👥' },
    { label: 'Active Cases', value: '324', change: '+12%', icon: '🏥' },
    { label: 'Consultations Today', value: '89', change: '+18%', icon: '📞' },
    { label: 'Vaccination Coverage', value: '78%', change: '+3%', icon: '💉' },
  ];

  const nextVillage = () => {
    setCarouselIndex((prev) => (prev + 1) % villages.length);
  };

  const prevVillage = () => {
    setCarouselIndex((prev) => (prev - 1 + villages.length) % villages.length);
  };

  const handleSaveVillage = () => {
    if (!editForm) return;

    if (!editForm.name || editForm.population <= 0) {
      alert('Please fill in all fields correctly');
      return;
    }

    setVillages(
      villages.map((v) => (v.id === editForm.id ? editForm : v))
    );
    setEditingVillage(null);
    setEditForm(null);
  };

  const handleAddVillage = () => {
    if (!editForm || !editForm.name || editForm.population <= 0) {
      alert('Please fill in all fields');
      return;
    }

    const newVillage: VillageData = {
      id: Date.now().toString(),
      name: editForm.name,
      population: editForm.population,
      coverage: editForm.coverage,
      activeWorkers: editForm.activeWorkers,
      activeCases: 0,
      closedCases: 0,
    };

    setVillages([...villages, newVillage]);
    setShowAddVillage(false);
    setEditForm(null);
  };

  const handleDeleteVillage = (id: string) => {
    if (window.confirm('Are you sure you want to delete this village?')) {
      setVillages(villages.filter((v) => v.id !== id));
      setEditingVillage(null);
    }
  };

  const handleApproveWorker = async (worker: PendingWorker) => {
    try {
      const workerId = worker._id || worker.id;
      
      if (!workerId) {
        console.error('Worker ID is missing:', worker);
        alert('Error: Worker ID not found. Please refresh and try again.');
        return;
      }

      console.log('🔍 Approving worker:', { workerId, fullName: worker.fullName });

      const response = await fetch(`/api/auth/health-workers/${workerId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'approved',
        }),
      });

      console.log('📡 API Response Status:', response.status);

      const responseData = await response.json();
      console.log('📡 API Response Data:', responseData);

      if (!response.ok) {
        throw new Error(responseData?.error || `HTTP ${response.status}: Failed to approve worker`);
      }

      // Refresh the list
      const updatedList = await loadPendingWorkers();
      setPendingWorkersList(updatedList);
      setSelectedWorker(null);
      alert(`✅ ${worker.fullName} has been approved and can now login!`);
    } catch (error) {
      console.error('❌ Error approving worker:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      alert(`Failed to approve worker: ${errorMessage}`);
    }
  };

  const handleDenyWorker = async (worker: PendingWorker) => {
    if (!denialReason.trim()) {
      alert('Please provide a reason for denial');
      return;
    }

    try {
      const workerId = worker._id || worker.id;
      
      if (!workerId) {
        console.error('Worker ID is missing:', worker);
        alert('Error: Worker ID not found. Please refresh and try again.');
        return;
      }

      console.log('🔍 Denying worker:', { workerId, fullName: worker.fullName, denialReason });

      const response = await fetch(`/api/auth/health-workers/${workerId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'denied',
          denialReason,
        }),
      });

      console.log('📡 API Response Status:', response.status);

      const responseData = await response.json();
      console.log('📡 API Response Data:', responseData);

      if (!response.ok) {
        throw new Error(responseData?.error || `HTTP ${response.status}: Failed to deny worker`);
      }

      // Refresh the list
      const updatedList = await loadPendingWorkers();
      setPendingWorkersList(updatedList);
      setSelectedWorker(null);
      setDenialReason('');
      alert(`✅ Application denied for ${worker.fullName}`);
    } catch (error) {
      console.error('❌ Error denying worker:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      alert(`Failed to deny worker: ${errorMessage}`);
    }
  };

  const handleGenerateReport = async () => {
    setIsGeneratingReport(true);
    setReportError(null);
    try {
      console.log('📊 Generating health report...');
      const response = await fetch('/api/admin/generate-report');
      
      if (!response.ok) {
        throw new Error(`Failed to generate report (${response.status})`);
      }

      // Get the HTML blob
      const blob = await response.blob();
      
      // Create a new window with the HTML content
      const htmlContent = await blob.text();
      const newWindow = window.open();
      if (newWindow) {
        newWindow.document.write(htmlContent);
        newWindow.document.close();
        
        // Give the browser a moment to render, then trigger print/save as PDF
        setTimeout(() => {
          newWindow.print();
        }, 250);
      }
      
      // Also save the HTML file as backup
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `health-report-${new Date().toISOString().split('T')[0]}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      console.log('✅ Health report generated successfully');
      alert('✅ Health report generated! Use the print dialog (Ctrl+P or Cmd+P) to save as PDF.\nYou can also find the HTML file in your Downloads folder.');
    } catch (error) {
      console.error('❌ Error generating report:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setReportError(errorMessage);
      alert(`Failed to generate report: ${errorMessage}`);
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const handleExportData = async () => {
    setIsExportingData(true);
    setExportError(null);
    try {
      console.log('📥 Exporting data...');
      const response = await fetch('/api/admin/export-data');
      
      if (!response.ok) {
        throw new Error(`Failed to export data (${response.status})`);
      }

      // Get the CSV blob
      const blob = await response.blob();
      
      // Create a download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `health-data-export-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      console.log('✅ Data exported successfully');
      alert('✅ Data exported successfully!');
    } catch (error) {
      console.error('❌ Error exporting data:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setExportError(errorMessage);
      alert(`Failed to export data: ${errorMessage}`);
    } finally {
      setIsExportingData(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-secondary rounded-2xl blur-lg opacity-30"></div>
              <div className="relative w-14 h-14 bg-gradient-to-br from-primary via-accent to-secondary rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-2xl">🏥</span>
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-secondary">
                Admin Dashboard
              </h1>
              <p className="text-xs text-muted-foreground font-medium">System Management & Analytics</p>
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
              onClick={onLogout}
              className="px-5 py-2.5 text-sm font-semibold text-destructive bg-destructive/10 hover:bg-destructive/20 rounded-xl transition-all flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 pb-32 relative z-10">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {stats.map((stat, idx) => (
                <div key={idx} className="group relative p-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-2 border-slate-200/50 dark:border-slate-800/50 rounded-2xl hover:shadow-xl hover:border-primary/30 transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                      {stat.icon}
                    </div>
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
                        stat.change.startsWith('+')
                          ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                          : 'bg-red-500/20 text-red-600 dark:text-red-400'
                      }`}
                    >
                      {stat.change}
                    </span>
                  </div>
                  <h3 className="text-sm text-muted-foreground font-medium mb-2">{stat.label}</h3>
                  <p className="text-3xl font-extrabold text-foreground">{stat.value}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <button 
                onClick={handleGenerateReport}
                disabled={isGeneratingReport}
                className="group relative p-6 bg-gradient-to-r from-primary to-primary/80 text-white rounded-2xl font-bold hover:shadow-xl hover:scale-105 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                <span className="relative flex items-center justify-center gap-2">
                {isGeneratingReport ? '⏳ Generating...' : '📄 Generate Report'}
                </span>
              </button>
              <button 
                onClick={handleExportData}
                disabled={isExportingData}
                className="group relative p-6 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-2xl font-bold hover:shadow-xl hover:scale-105 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                <span className="relative flex items-center justify-center gap-2">
                {isExportingData ? '⏳ Exporting...' : '📥 Export Data'}
                </span>
              </button>
              <button
                onClick={() => setActiveTab('approvals')}
                className="group relative p-6 bg-gradient-to-r from-accent to-accent/80 text-white rounded-2xl font-bold hover:shadow-xl hover:scale-105 active:scale-[0.98] transition-all overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                <span className="relative flex items-center justify-center gap-2">
                Approvals ({pendingWorkersList.length})
                </span>
              </button>
            </div>
            
            {reportError && (
              <div className="p-4 bg-destructive/10 border-2 border-destructive rounded-lg">
                <p className="text-sm text-destructive">❌ Report Error: {reportError}</p>
              </div>
            )}
            
            {exportError && (
              <div className="p-4 bg-destructive/10 border-2 border-destructive rounded-lg">
                <p className="text-sm text-destructive">❌ Export Error: {exportError}</p>
              </div>
            )}

            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-1 w-12 bg-gradient-to-r from-primary to-accent rounded-full"></div>
                <h2 className="text-2xl font-extrabold text-foreground">Recent Alerts</h2>
              </div>
              <div className="space-y-4">
                {alerts.slice(0, 2).map((alert) => (
                  <div key={alert.id} className={`p-5 rounded-2xl border-l-4 backdrop-blur-xl ${
                    alert.type === 'critical'
                      ? 'bg-red-500/10 dark:bg-red-500/20 border-red-500'
                      : 'bg-yellow-500/10 dark:bg-yellow-500/20 border-yellow-500'
                  }`}>
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-bold text-lg text-foreground">{alert.title}</h3>
                      <span className="text-xs text-muted-foreground font-medium">{alert.timestamp}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{alert.description}</p>
                    <p className="text-xs text-muted-foreground mt-2">📍 {alert.village}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'villages' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-foreground mb-4">Village Management</h2>

            <div className="space-y-4">
              <div className="relative bg-gradient-to-r from-primary/20 to-accent/20 border-2 border-primary rounded-lg p-8 min-h-80 flex items-center justify-center">
                {villages.length > 0 ? (
                  <div className="text-center space-y-4 w-full">
                    <div className="text-6xl mb-4">🏘️</div>
                    <h3 className="text-3xl font-bold text-foreground">{villages[carouselIndex].name}</h3>
                    <div className="grid grid-cols-4 gap-4 mt-6">
                      <div className="bg-card p-3 rounded">
                        <p className="text-xs text-muted-foreground">Population</p>
                        <p className="text-xl font-bold text-foreground">
                          {villages[carouselIndex].population.toLocaleString()}
                        </p>
                      </div>
                      <div className="bg-card p-3 rounded">
                        <p className="text-xs text-muted-foreground">Coverage</p>
                        <p className="text-xl font-bold text-primary">
                          {villages[carouselIndex].coverage}%
                        </p>
                      </div>
                      <div className="bg-card p-3 rounded">
                        <p className="text-xs text-muted-foreground">Active Cases</p>
                        <p className="text-xl font-bold text-accent">
                          {villages[carouselIndex].activeCases}
                        </p>
                      </div>
                      <div className="bg-card p-3 rounded">
                        <p className="text-xs text-muted-foreground">Closed Cases</p>
                        <p className="text-xl font-bold text-secondary">
                          {villages[carouselIndex].closedCases}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4 justify-center mt-6">
                      <button
                        onClick={() => {
                          setEditingVillage(villages[carouselIndex]);
                          setEditForm({ ...villages[carouselIndex] });
                        }}
                        className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-bold hover:bg-primary/90"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteVillage(villages[carouselIndex].id)}
                        className="px-6 py-2 bg-destructive text-destructive-foreground rounded-lg font-bold hover:bg-destructive/90"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground">No villages added</p>
                )}

                {villages.length > 1 && (
                  <>
                    <button
                      onClick={prevVillage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-primary text-primary-foreground p-3 rounded-full hover:bg-primary/90 font-bold text-xl"
                    >
                      ←
                    </button>
                    <button
                      onClick={nextVillage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-primary text-primary-foreground p-3 rounded-full hover:bg-primary/90 font-bold text-xl"
                    >
                      →
                    </button>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                      {villages.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCarouselIndex(idx)}
                          className={`w-2 h-2 rounded-full transition-all ${
                            idx === carouselIndex ? 'bg-primary w-6' : 'bg-muted'
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {editingVillage && editForm && (
              <div className="p-6 bg-card border-2 border-border rounded-lg space-y-4">
                <h3 className="text-xl font-bold text-foreground">Edit Village: {editForm.name}</h3>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-foreground mb-2">
                      Village Name
                    </label>
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border-2 border-border bg-background text-foreground"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-foreground mb-2">
                      Population
                    </label>
                    <input
                      type="number"
                      value={editForm.population}
                      onChange={(e) =>
                        setEditForm({ ...editForm, population: parseInt(e.target.value) || 0 })
                      }
                      className="w-full px-4 py-2 rounded-lg border-2 border-border bg-background text-foreground"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-foreground mb-2">
                      Coverage (%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={editForm.coverage}
                      onChange={(e) =>
                        setEditForm({ ...editForm, coverage: parseInt(e.target.value) || 0 })
                      }
                      className="w-full px-4 py-2 rounded-lg border-2 border-border bg-background text-foreground"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-foreground mb-2">
                      Active Workers
                    </label>
                    <input
                      type="number"
                      value={editForm.activeWorkers}
                      onChange={(e) =>
                        setEditForm({ ...editForm, activeWorkers: parseInt(e.target.value) || 0 })
                      }
                      className="w-full px-4 py-2 rounded-lg border-2 border-border bg-background text-foreground"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-foreground mb-2">
                      Active Cases
                    </label>
                    <input
                      type="number"
                      value={editForm.activeCases}
                      onChange={(e) =>
                        setEditForm({ ...editForm, activeCases: parseInt(e.target.value) || 0 })
                      }
                      className="w-full px-4 py-2 rounded-lg border-2 border-border bg-background text-foreground"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-foreground mb-2">
                      Closed Cases
                    </label>
                    <input
                      type="number"
                      value={editForm.closedCases}
                      onChange={(e) =>
                        setEditForm({ ...editForm, closedCases: parseInt(e.target.value) || 0 })
                      }
                      className="w-full px-4 py-2 rounded-lg border-2 border-border bg-background text-foreground"
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleSaveVillage}
                    className="flex-1 py-2 bg-primary text-primary-foreground rounded-lg font-bold hover:bg-primary/90"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => {
                      setEditingVillage(null);
                      setEditForm(null);
                    }}
                    className="flex-1 py-2 bg-muted text-muted-foreground rounded-lg font-bold hover:bg-muted/80"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {showAddVillage && (
              <div className="p-6 bg-card border-2 border-border rounded-lg space-y-4">
                <h3 className="text-xl font-bold text-foreground">Add New Village</h3>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-foreground mb-2">
                      Village Name
                    </label>
                    <input
                      type="text"
                      value={editForm?.name || ''}
                      onChange={(e) =>
                        setEditForm({
                          id: Date.now().toString(),
                          name: e.target.value,
                          population: 0,
                          coverage: 0,
                          activeWorkers: 0,
                          activeCases: 0,
                          closedCases: 0,
                        })
                      }
                      className="w-full px-4 py-2 rounded-lg border-2 border-border bg-background text-foreground"
                      placeholder="Enter village name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-foreground mb-2">
                      Population
                    </label>
                    <input
                      type="number"
                      value={editForm?.population || 0}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm!,
                          population: parseInt(e.target.value) || 0,
                        })
                      }
                      className="w-full px-4 py-2 rounded-lg border-2 border-border bg-background text-foreground"
                      placeholder="Enter population"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-foreground mb-2">
                      Coverage (%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={editForm?.coverage || 0}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm!,
                          coverage: parseInt(e.target.value) || 0,
                        })
                      }
                      className="w-full px-4 py-2 rounded-lg border-2 border-border bg-background text-foreground"
                      placeholder="Enter coverage %"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-foreground mb-2">
                      Active Workers
                    </label>
                    <input
                      type="number"
                      value={editForm?.activeWorkers || 0}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm!,
                          activeWorkers: parseInt(e.target.value) || 0,
                        })
                      }
                      className="w-full px-4 py-2 rounded-lg border-2 border-border bg-background text-foreground"
                      placeholder="Enter number of workers"
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleAddVillage}
                    className="flex-1 py-2 bg-primary text-primary-foreground rounded-lg font-bold hover:bg-primary/90"
                  >
                    Add Village
                  </button>
                  <button
                    onClick={() => {
                      setShowAddVillage(false);
                      setEditForm(null);
                    }}
                    className="flex-1 py-2 bg-muted text-muted-foreground rounded-lg font-bold hover:bg-muted/80"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {!editingVillage && !showAddVillage && (
              <button
                onClick={() => setShowAddVillage(true)}
                className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-bold hover:bg-primary/90"
              >
                Add New Village
              </button>
            )}

            {/* Village List */}
            <div className="space-y-3">
              <h3 className="font-bold text-foreground">All Villages</h3>
              {villages.map((village) => (
                <div key={village.id} className="p-4 bg-card border-2 border-border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-foreground text-lg">{village.name}</h4>
                    <span className={`text-sm font-bold px-3 py-1 rounded ${
                      village.coverage >= 80
                        ? 'bg-secondary text-secondary-foreground'
                        : village.coverage >= 70
                          ? 'bg-accent text-accent-foreground'
                          : 'bg-destructive text-destructive-foreground'
                    }`}>
                      {village.coverage}% Coverage
                    </span>
                  </div>

                  <div className="grid grid-cols-4 gap-2 text-sm">
                    <div className="bg-muted p-2 rounded">
                      <p className="text-xs text-muted-foreground">Population</p>
                      <p className="font-bold text-foreground">
                        {village.population.toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-muted p-2 rounded">
                      <p className="text-xs text-muted-foreground">Workers</p>
                      <p className="font-bold text-foreground">{village.activeWorkers}</p>
                    </div>
                    <div className="bg-muted p-2 rounded">
                      <p className="text-xs text-muted-foreground">Active</p>
                      <p className="font-bold text-foreground">{village.activeCases}</p>
                    </div>
                    <div className="bg-muted p-2 rounded">
                      <p className="text-xs text-muted-foreground">Closed</p>
                      <p className="font-bold text-foreground">{village.closedCases}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'alerts' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-foreground mb-4">System Alerts</h2>

            <div className="space-y-3">
              {alerts.map((alert) => (
                <div key={alert.id} className={`p-4 rounded-lg border-2 ${
                  alert.type === 'critical'
                    ? 'bg-destructive/10 border-destructive'
                    : 'bg-accent/10 border-accent'
                }`}>
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">
                      {alert.type === 'critical' ? '🚨' : '⚠️'}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-bold text-foreground">{alert.title}</h3>
                        <span className={`text-xs font-bold px-2 py-1 rounded ${
                          alert.type === 'critical'
                            ? 'bg-destructive text-destructive-foreground'
                            : 'bg-accent text-accent-foreground'
                        }`}>
                          {alert.type.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {alert.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'workers' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-foreground mb-4">Health Workers Activity</h2>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-border">
                    <th className="text-left py-3 px-4 font-bold text-foreground">Name</th>
                    <th className="text-left py-3 px-4 font-bold text-foreground">Village</th>
                    <th className="text-left py-3 px-4 font-bold text-foreground">Status</th>
                    <th className="text-left py-3 px-4 font-bold text-foreground">Cases</th>
                  </tr>
                </thead>
                <tbody>
                  {workers.map((worker, idx) => (
                    <tr key={idx} className="border-b border-border hover:bg-muted/30">
                      <td className="py-3 px-4 text-foreground font-semibold">
                        {worker.name}
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">{worker.village}</td>
                      <td className="py-3 px-4">
                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                          worker.status === 'online'
                            ? 'bg-secondary text-secondary-foreground'
                            : 'bg-muted text-muted-foreground'
                        }`}>
                          {worker.status === 'online' ? 'Online' : 'Offline'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-foreground font-bold">{worker.cases}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-foreground mb-4">Analytics & Reports</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="p-6 bg-card border-2 border-border rounded-lg">
                <h3 className="font-bold text-foreground mb-4">
                  Vaccination Coverage by Village
                </h3>
                <div className="space-y-3">
                  {villages.map((v, idx) => (
                    <div key={idx}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-semibold text-foreground">{v.name}</span>
                        <span className="text-sm text-muted-foreground">{v.coverage}%</span>
                      </div>
                      <div className="bg-muted rounded-full h-2">
                        <div
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${v.coverage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6 bg-card border-2 border-border rounded-lg">
                <h3 className="font-bold text-foreground mb-4">Active Cases by Village</h3>
                <div className="flex items-end justify-around h-48 gap-2">
                  {villages.map((v, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                      <div
                        className="flex-1 bg-primary rounded-t flex items-end justify-center w-full"
                        style={{ height: `${(v.activeCases / 30) * 100}%` }}
                      >
                        <span className="text-xs font-bold text-primary-foreground pb-1">
                          {v.activeCases}
                        </span>
                      </div>
                      <span className="text-xs text-foreground font-semibold">{v.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 bg-card border-2 border-border rounded-lg">
              <h3 className="font-bold text-foreground mb-4">Download Reports</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <button className="p-4 bg-primary text-primary-foreground rounded-lg font-bold hover:bg-primary/90 active:scale-95">
                  Weekly Report
                </button>
                <button className="p-4 bg-secondary text-secondary-foreground rounded-lg font-bold hover:bg-secondary/90 active:scale-95">
                  Monthly Summary
                </button>
                <button className="p-4 bg-accent text-accent-foreground rounded-lg font-bold hover:bg-accent/90 active:scale-95">
                  Quarterly Analysis
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'approvals' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="h-1 w-12 bg-gradient-to-r from-primary to-accent rounded-full"></div>
                <h2 className="text-3xl font-extrabold text-foreground">Health Worker Applications</h2>
              </div>
              <div className="flex items-center gap-3">
                <span className="bg-gradient-to-r from-primary to-accent text-white px-5 py-2 rounded-full text-sm font-bold shadow-lg">
                {pendingWorkersList.length} Pending
              </span>
                <button
                  onClick={() => loadPendingWorkers().then(setPendingWorkersList)}
                  className="px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-semibold hover:bg-slate-300 dark:hover:bg-slate-700 transition-all flex items-center gap-2"
                  title="Refresh list"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Refresh
                </button>
              </div>
            </div>

            {selectedWorker ? (
              <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-2 border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-8 space-y-6 shadow-xl">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-extrabold text-foreground mb-1">
                    {selectedWorker.fullName}
                  </h3>
                    <p className="text-sm text-muted-foreground">{selectedWorker.email}</p>
                  </div>
                  <button
                    onClick={() => setSelectedWorker(null)}
                    className="p-2 text-muted-foreground hover:text-foreground hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl transition-all"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wide mb-4">Personal Information</h4>
                  <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                        <p className="text-xs text-muted-foreground mb-1">Full Name</p>
                        <p className="font-bold text-foreground">{selectedWorker.fullName}</p>
                    </div>
                      <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                        <p className="text-xs text-muted-foreground mb-1">Phone Number</p>
                        <p className="font-bold text-foreground">{selectedWorker.phoneNumber}</p>
                    </div>
                      <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                        <p className="text-xs text-muted-foreground mb-1">Email</p>
                        <p className="font-bold text-foreground break-all">{selectedWorker.email}</p>
                    </div>
                      <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                        <p className="text-xs text-muted-foreground mb-1">Applied Date</p>
                        <p className="font-bold text-foreground">{selectedWorker.appliedDate}</p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-slate-200 dark:border-slate-800 pt-6">
                    <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wide mb-4">Professional Details</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                        <p className="text-xs text-muted-foreground mb-1">Qualification</p>
                        <p className="font-bold text-foreground">{selectedWorker.qualification}</p>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                        <p className="text-xs text-muted-foreground mb-1">Medical Registration Number</p>
                        <p className="font-bold text-foreground">{selectedWorker.registrationNumber}</p>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                        <p className="text-xs text-muted-foreground mb-1">Year of Registration</p>
                        <p className="font-bold text-foreground">{selectedWorker.yearOfRegistration || 'Not provided'}</p>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                        <p className="text-xs text-muted-foreground mb-1">State Medical Council</p>
                        <p className="font-bold text-foreground">{selectedWorker.stateMedicalCouncil || 'Not provided'}</p>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                        <p className="text-xs text-muted-foreground mb-1">Specialized Stream</p>
                        <p className="font-bold text-foreground">{selectedWorker.specializedStream}</p>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                        <p className="text-xs text-muted-foreground mb-1">Years of Experience</p>
                        <p className="font-bold text-foreground">{selectedWorker.yearsOfExperience} years</p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-border pt-4">
                    <h4 className="font-bold text-foreground mb-3">Workplace & Location</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-muted p-3 rounded">
                        <p className="text-xs text-muted-foreground">Hospital/Clinic Name</p>
                        <p className="font-semibold text-foreground">{selectedWorker.hospitalClinicName}</p>
                      </div>
                      <div className="bg-muted p-3 rounded">
                        <p className="text-xs text-muted-foreground">District</p>
                        <p className="font-semibold text-foreground">{selectedWorker.district}</p>
                      </div>
                      <div className="bg-muted p-3 rounded col-span-2">
                        <p className="text-xs text-muted-foreground">Village</p>
                        <p className="font-semibold text-foreground">{selectedWorker.village}</p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-border pt-4">
                    <h4 className="font-bold text-foreground mb-3">Uploaded Documents</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-muted p-3 rounded">
                        <p className="text-xs text-muted-foreground">Government ID</p>
                        <p className="font-semibold text-foreground text-sm break-all">
                          {selectedWorker.governmentIdFileName || 'Not uploaded'}
                        </p>
                      </div>
                      <div className="bg-muted p-3 rounded">
                        <p className="text-xs text-muted-foreground">Certificate/License Proof</p>
                        <p className="font-semibold text-foreground text-sm break-all">
                          {selectedWorker.proofFileName || 'Not uploaded'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {selectedWorker.status === 'pending' && (
                  <div className="space-y-4 mt-6 pt-4 border-t border-border">
                    <div>
                      <label className="block text-sm font-bold text-foreground mb-2">
                        Denial Reason (if applicable)
                      </label>
                      <textarea
                        value={denialReason}
                        onChange={(e) => setDenialReason(e.target.value)}
                        placeholder="Enter reason for denial..."
                        className="w-full px-4 py-3 rounded-lg border-2 border-border bg-background text-foreground resize-none"
                        rows={3}
                      />
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => handleApproveWorker(selectedWorker)}
                        className="flex-1 py-3 bg-secondary text-secondary-foreground rounded-lg font-bold hover:bg-secondary/90"
                      >
                        Approve Access
                      </button>
                      <button
                        onClick={() => handleDenyWorker(selectedWorker)}
                        className="flex-1 py-3 bg-destructive text-destructive-foreground rounded-lg font-bold hover:bg-destructive/90"
                      >
                        Deny Request
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {pendingWorkersList.length === 0 ? (
                  <div className="p-8 bg-card border-2 border-border rounded-lg text-center">
                    <p className="text-muted-foreground">No pending applications</p>
                  </div>
                ) : (
                  pendingWorkersList.map((worker) => (
                    <div key={worker._id || worker.id} className="group p-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-2 border-slate-200/50 dark:border-slate-800/50 rounded-2xl hover:shadow-xl hover:border-primary/30 transition-all">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h4 className="font-extrabold text-foreground text-xl mb-2">
                            {worker.fullName}
                          </h4>
                          <p className="text-sm text-muted-foreground mb-1">{worker.email}</p>
                          <p className="text-sm font-semibold text-foreground mb-1">
                            {worker.qualification} - {worker.specializedStream}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            📍 {worker.hospitalClinicName}, {worker.village}
                          </p>
                        </div>
                        <div className="flex gap-3 flex-shrink-0">
                          <a
                            href="https://www.nmc.org.in/information-desk/indian-medical-register/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-5 py-2.5 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-bold hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2"
                          >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                            Verify Doctor
                          </a>
                        <button
                          onClick={() => setSelectedWorker(worker)}
                            className="px-5 py-2.5 bg-gradient-to-r from-primary to-accent text-white rounded-xl font-bold hover:shadow-xl hover:scale-105 transition-all"
                        >
                          Review
                        </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-t border-slate-200/50 dark:border-slate-800/50 shadow-2xl z-50">
        <div className="max-w-7xl mx-auto px-2 flex items-center justify-around overflow-x-auto">
          {[
            { id: 'overview' as const, icon: '📊', label: 'Overview' },
            {
              id: 'approvals' as const,
              icon: '✅',
              label: `Approvals (${pendingWorkersList.length})`,
            },
            { id: 'villages' as const, icon: '🗺️', label: 'Villages' },
            { id: 'alerts' as const, icon: '🚨', label: 'Alerts' },
            { id: 'workers' as const, icon: '👥', label: 'Workers' },
            { id: 'analytics' as const, icon: '📈', label: 'Analytics' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setActiveTab(tab.id);
              }}
              className={`relative flex-1 flex flex-col items-center justify-center py-4 gap-1.5 font-semibold transition-all min-w-0 px-1 ${
                activeTab === tab.id
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {activeTab === tab.id && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-primary to-accent rounded-b-full"></div>
              )}
              <span className="text-xl sm:text-2xl">{tab.icon}</span>
              <span className="text-xs truncate w-full text-center">{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
