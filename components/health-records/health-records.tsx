import { useState } from 'react';

type RecordTab = 'vaccinations' | 'pregnancy' | 'chronic' | 'visits';

export default function HealthRecords() {
  const [activeTab, setActiveTab] = useState<RecordTab>('vaccinations');

  const vaccinations = [
    { name: 'COVID-19 Dose 1', date: 'Jan 15, 2024', status: 'Completed' },
    { name: 'COVID-19 Dose 2', date: 'Feb 15, 2024', status: 'Completed' },
    { name: 'COVID-19 Booster', date: 'Jan 15, 2025', status: 'Pending' },
    { name: 'Polio', date: 'Mar 2024', status: 'Completed' },
    { name: 'Tetanus', date: 'Apr 2023', status: 'Completed' },
  ];

  const pregnancyRecords = [
    {
      week: '20 weeks',
      date: 'Oct 5, 2024',
      weight: '67 kg',
      bp: '120/80',
      notes: 'Normal progression, baby developing well',
    },
    {
      week: '16 weeks',
      date: 'Sep 7, 2024',
      weight: '65 kg',
      bp: '118/78',
      notes: 'First trimester screening normal',
    },
  ];

  const chronicDiseases = [
    { condition: 'Hypertension', diagnosed: 'Jan 2020', medication: 'Amlodipine 5mg', status: 'Controlled' },
    { condition: 'Type 2 Diabetes', diagnosed: 'Mar 2021', medication: 'Metformin 500mg', status: 'Controlled' },
  ];

  const visitHistory = [
    { date: 'Dec 10, 2024', type: 'Video Consultation', doctor: 'Dr. Rajesh Kumar', reason: 'Fever & Cough' },
    { date: 'Nov 28, 2024', type: 'In-Person Visit', doctor: 'Dr. Priya Singh', reason: 'Routine Checkup' },
    { date: 'Nov 5, 2024', type: 'Phone Consultation', doctor: 'Dr. Amit Patel', reason: 'BP Monitoring' },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center py-8">
        <div className="text-4xl mb-4">📋</div>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Health Records
        </h2>
        <p className="text-muted-foreground">Your complete medical history</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {[
          { id: 'vaccinations' as const, label: 'Vaccinations', icon: '💉' },
          { id: 'pregnancy' as const, label: 'Pregnancy', icon: '👶' },
          { id: 'chronic' as const, label: 'Chronic', icon: '💊' },
          { id: 'visits' as const, label: 'Visits', icon: '📅' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="space-y-3">
        {activeTab === 'vaccinations' && vaccinations.map((v, idx) => (
          <div key={idx} className="p-4 bg-card border-2 border-border rounded-lg">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-bold text-foreground">{v.name}</h3>
                <p className="text-sm text-muted-foreground">{v.date}</p>
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded ${
                v.status === 'Completed'
                  ? 'bg-secondary text-secondary-foreground'
                  : 'bg-accent text-accent-foreground'
              }`}>
                {v.status}
              </span>
            </div>
          </div>
        ))}

        {activeTab === 'pregnancy' && pregnancyRecords.map((p, idx) => (
          <div key={idx} className="p-4 bg-card border-2 border-border rounded-lg space-y-2">
            <h3 className="font-bold text-foreground">{p.week} Checkup</h3>
            <p className="text-sm text-muted-foreground">{p.date}</p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="bg-muted p-2 rounded">
                <p className="text-xs text-muted-foreground">Weight</p>
                <p className="font-semibold text-foreground">{p.weight}</p>
              </div>
              <div className="bg-muted p-2 rounded">
                <p className="text-xs text-muted-foreground">BP</p>
                <p className="font-semibold text-foreground">{p.bp}</p>
              </div>
            </div>
            <p className="text-sm text-foreground bg-primary/10 p-2 rounded">{p.notes}</p>
          </div>
        ))}

        {activeTab === 'chronic' && chronicDiseases.map((d, idx) => (
          <div key={idx} className="p-4 bg-card border-2 border-border rounded-lg space-y-2">
            <div className="flex items-start justify-between">
              <h3 className="font-bold text-foreground">{d.condition}</h3>
              <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded">
                {d.status}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">Diagnosed: {d.diagnosed}</p>
            <div className="bg-muted p-2 rounded text-sm">
              <p className="text-xs text-muted-foreground mb-1">Current Medication</p>
              <p className="font-semibold text-foreground">{d.medication}</p>
            </div>
          </div>
        ))}

        {activeTab === 'visits' && visitHistory.map((v, idx) => (
          <div key={idx} className="p-4 bg-card border-2 border-border rounded-lg space-y-2">
            <div className="flex items-start justify-between">
              <h3 className="font-bold text-foreground">{v.type}</h3>
              <p className="text-xs text-muted-foreground">{v.date}</p>
            </div>
            <p className="text-sm text-foreground">Dr. {v.doctor}</p>
            <p className="text-sm text-muted-foreground">Reason: {v.reason}</p>
          </div>
        ))}
      </div>

      {/* Download */}
      <button className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-bold hover:bg-primary/90">
        📥 Download Full Medical Record
      </button>
    </div>
  );
}
