import { useState } from 'react';

type CheckerStep = 'start' | 'questions' | 'results';

interface SymptomResult {
  condition: string;
  urgency: 'low' | 'medium' | 'high';
  description: string;
}

interface SymptomCheckerProps {
  onBack?: () => void;
  onTalkWithAI?: () => void;
  onConsultDoctor?: () => void;
}

export default function SymptomChecker({
  onBack,
  onTalkWithAI,
  onConsultDoctor,
}: SymptomCheckerProps) {
  const [step, setStep] = useState<CheckerStep>('start');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [customSymptom, setCustomSymptom] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [showDoctorPanel, setShowDoctorPanel] = useState(false);

  const symptoms = [
    '🤒 Fever',
    '😷 Cough',
    '🤧 Runny Nose',
    '🤕 Headache',
    '😫 Fatigue',
    '🤮 Nausea',
    '🤔 Confusion',
    '😤 Difficulty Breathing',
  ];

  const results: SymptomResult[] = [
    {
      condition: 'Common Cold',
      urgency: 'low',
      description:
        'Rest, stay hydrated, and use over-the-counter medications for symptom relief.',
    },
    {
      condition: 'Influenza (Flu)',
      urgency: 'medium',
      description:
        'Contact a health worker. Antiviral treatment may be recommended within 48 hours.',
    },
  ];

  const activeDoctors = [
    {
      name: 'Dr. Aditi Verma',
      specialty: 'General Physician',
      status: 'Available now',
      experience: '10 yrs',
    },
    {
      name: 'Dr. Rohan Singh',
      specialty: 'Community Health',
      status: 'Online',
      experience: '7 yrs',
    },
    {
      name: 'Dr. Meera Patel',
      specialty: 'Telemedicine',
      status: 'Available in 10 mins',
      experience: '12 yrs',
    },
  ];

  const toggleSymptom = (symptom: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(symptom)
        ? prev.filter((s) => s !== symptom)
        : [...prev, symptom]
    );
  };

  const handleAddCustomSymptom = () => {
    if (customSymptom.trim() && !selectedSymptoms.includes(customSymptom)) {
      setSelectedSymptoms([...selectedSymptoms, customSymptom]);
      setCustomSymptom('');
      setShowCustomInput(false);
    }
  };

  const removeSymptom = (symptom: string) => {
    setSelectedSymptoms(prev => prev.filter(s => s !== symptom));
  };

  if (step === 'start') {
    return (
      <div className="space-y-6">
        <div>
          {onBack && (
            <button
              onClick={onBack}
              className="text-primary font-semibold text-sm flex items-center gap-1 hover:text-primary/80 mb-4"
            >
              ← Back
            </button>
          )}
        </div>

        <div className="text-center py-12">
          <div className="text-4xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            AI Symptom Checker
          </h2>
          <p className="text-muted-foreground">
            Answer a few questions about your symptoms to get personalized health guidance
          </p>
        </div>

        <button
          onClick={() => setStep('questions')}
          className="w-full py-4 bg-primary text-primary-foreground rounded-lg font-bold text-lg hover:bg-primary/90 active:scale-95"
        >
          Start Symptom Check
        </button>

        <p className="text-xs text-muted-foreground text-center">
          This is not a medical diagnosis. Always consult with healthcare professionals.
        </p>
      </div>
    );
  }

  if (step === 'questions') {
    return (
      <div className="space-y-6">
        <div>
          {onBack && (
            <button
              onClick={onBack}
              className="text-primary font-semibold text-sm flex items-center gap-1 hover:text-primary/80 mb-4"
            >
              ← Back
            </button>
          )}
          <h2 className="text-xl font-bold text-foreground mb-4">
            What symptoms are you experiencing?
          </h2>
          <p className="text-muted-foreground mb-6">
            Select all that apply (step 1 of 3)
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 max-w-full">
          {symptoms.map((symptom) => (
            <button
              key={symptom}
              onClick={() => toggleSymptom(symptom)}
              className={`p-4 rounded-xl font-semibold transition-all text-sm sm:text-base break-words ${
                selectedSymptoms.includes(symptom)
                  ? 'bg-gradient-to-r from-primary to-accent text-white border-2 border-primary shadow-lg'
                  : 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-2 border-slate-200/50 dark:border-slate-800/50 text-foreground hover:border-primary hover:shadow-md'
              }`}
            >
              {symptom}
            </button>
          ))}
        </div>

        {selectedSymptoms.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-semibold text-foreground">Selected Symptoms:</p>
            <div className="flex flex-wrap gap-2">
              {selectedSymptoms.map((symptom) => (
                <div
                  key={symptom}
                  className="bg-primary/20 border border-primary rounded-full px-3 py-1 flex items-center gap-2 text-sm text-foreground"
                >
                  {symptom}
                  <button
                    onClick={() => removeSymptom(symptom)}
                    className="text-primary hover:text-primary/80 font-bold"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-secondary/10 border-2 border-secondary rounded-lg p-4">
          <button
            onClick={() => setShowCustomInput(!showCustomInput)}
            className="w-full text-left font-semibold text-foreground hover:text-primary transition-colors"
          >
            + Add Custom Symptom
          </button>
          
          {showCustomInput && (
            <div className="mt-3 space-y-3">
              <input
                type="text"
                value={customSymptom}
                onChange={(e) => setCustomSymptom(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddCustomSymptom()}
                placeholder="Describe your symptom..."
                className="w-full px-3 py-2 rounded-lg bg-background border-2 border-border text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleAddCustomSymptom}
                  disabled={!customSymptom.trim()}
                  className="flex-1 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 disabled:opacity-50"
                >
                  Add
                </button>
                <button
                  onClick={() => {
                    setShowCustomInput(false);
                    setCustomSymptom('');
                  }}
                  className="flex-1 py-2 bg-muted text-muted-foreground rounded-lg font-semibold hover:bg-muted/80"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="w-full bg-muted rounded-full h-2">
          <div className="bg-primary h-2 rounded-full w-1/3"></div>
        </div>

        <div className="flex gap-3 pb-4">
          <button
            onClick={() => setStep('start')}
            className="flex-1 py-3 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-bold hover:bg-slate-300 dark:hover:bg-slate-700 transition-all"
          >
            Back
          </button>
          <button
            onClick={() => setStep('results')}
            disabled={selectedSymptoms.length === 0}
            className="flex-1 py-3 bg-gradient-to-r from-primary to-accent text-white rounded-xl font-bold hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-32">
      <div>
        {onBack && (
          <button
            onClick={onBack}
            className="text-primary font-semibold text-sm flex items-center gap-1 hover:text-primary/80 mb-4"
          >
            ← Back
          </button>
        )}
      </div>

      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Based on your symptoms:
        </h2>
        <p className="text-muted-foreground mb-6">
          {selectedSymptoms.join(', ')}
        </p>
      </div>

      <div className="space-y-4">
        {results.map((result, idx) => (
          <div
            key={idx}
            className={`p-5 rounded-2xl border ${
              result.urgency === 'high'
                ? 'bg-red-500/10 border-red-500/40'
                : result.urgency === 'medium'
                  ? 'bg-amber-500/10 border-amber-500/40'
                  : 'bg-emerald-500/10 border-emerald-500/40'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
              <h3 className="font-bold text-foreground text-lg">{result.condition}</h3>
              <span
                className={`text-xs font-bold px-4 py-1 rounded-full tracking-wide ${
                  result.urgency === 'high'
                    ? 'bg-red-500 text-white'
                    : result.urgency === 'medium'
                      ? 'bg-amber-500 text-white'
                      : 'bg-emerald-500 text-white'
                }`}
              >
                {result.urgency.toUpperCase()}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">{result.description}</p>
          </div>
        ))}
      </div>

      <div className="bg-primary/10 border border-primary/30 p-5 rounded-2xl shadow-inner">
        <p className="font-semibold text-foreground mb-2">Next Steps:</p>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>✓ Start a consultation with AI Assistant</li>
          <li>✓ Schedule remote consultation with health worker</li>
          <li>✓ Visit nearest health center if urgent</li>
        </ul>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-full pb-4">
        <button
          onClick={() => {
            onTalkWithAI ? onTalkWithAI() : setStep('start');
          }}
          className="w-full flex items-center justify-center gap-2 px-4 py-4 rounded-xl bg-gradient-to-r from-primary via-accent to-secondary text-white font-bold text-base shadow-xl hover:shadow-2xl hover:scale-105 active:scale-100 transition-all"
        >
          🤖 Talk with AI
        </button>
        <button
          onClick={() => {
            setShowDoctorPanel(true);
            onConsultDoctor?.();
          }}
          className="w-full flex items-center justify-center gap-2 px-4 py-4 rounded-xl bg-white/90 dark:bg-slate-900/80 border-2 border-slate-200/60 dark:border-slate-800/60 text-foreground font-bold text-base shadow-xl hover:shadow-2xl hover:scale-105 active:scale-100 transition-all"
        >
          🩺 Consult Doctor
        </button>
      </div>

      {showDoctorPanel && (
        <div className="space-y-3 bg-white/80 dark:bg-slate-900/80 border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-5">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <p className="text-sm font-semibold text-primary">Active Doctors</p>
              <h3 className="text-xl font-bold text-foreground">Available Now</h3>
            </div>
            <button
              onClick={() => setShowDoctorPanel(false)}
              className="text-xs font-semibold text-muted-foreground hover:text-foreground"
            >
              Close ✕
            </button>
          </div>
          <div className="space-y-3">
            {activeDoctors.map((doc) => (
              <div
                key={doc.name}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-gradient-to-br from-slate-50/80 to-slate-100/40 dark:from-slate-800/60 dark:to-slate-800/30 border border-slate-200/60 dark:border-slate-800/60"
              >
                <div>
                  <p className="font-semibold text-foreground">{doc.name}</p>
                  <p className="text-sm text-muted-foreground">{doc.specialty}</p>
                  <p className="text-xs text-muted-foreground/80">Experience: {doc.experience}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 text-xs font-semibold rounded-full bg-emerald-500/20 text-emerald-600">
                    {doc.status}
                  </span>
                  <button className="px-4 py-2 text-xs font-bold rounded-xl bg-primary text-white hover:bg-primary/90">
                    View Profile
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
