import { useState } from 'react';

type ConsultationStep = 'options' | 'appointment' | 'waiting' | 'active' | 'summary';

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  experience: string;
  waitTime: string;
  hospital: string;
  rating: number;
  patients: number;
  languages: string[];
  slots: string[];
  isActive: boolean;
  bio: string;
  avatar: string;
}

export default function RemoteConsultation() {
  const [step, setStep] = useState<ConsultationStep>('options');
  const [selectedMode, setSelectedMode] = useState<'video' | 'audio' | null>(null);
  const [sessionTime, setSessionTime] = useState(0);
  const [sessionNotes, setSessionNotes] = useState('');
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [doctorFilter, setDoctorFilter] = useState<'all' | 'active'>('active');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [detailsDoctor, setDetailsDoctor] = useState<Doctor | null>(null);
  const [appointmentForm, setAppointmentForm] = useState({
    date: '',
    time: '',
    mode: 'video' as 'video' | 'audio',
    reason: '',
  });

  const modes = [
    { id: 'video', icon: '📹', label: 'Video Call', desc: 'Face-to-face consultation' },
    { id: 'audio', icon: '📱', label: 'Audio Call', desc: 'Phone consultation' },
  ];

  const doctors: Doctor[] = [
    {
      id: 'doc-1',
      name: 'Dr. Rajesh Kumar',
      specialty: 'General Physician',
      experience: '12 yrs',
      waitTime: '5 min',
      hospital: 'AIIMS Delhi',
      rating: 4.9,
      patients: 2340,
      languages: ['English', 'Hindi'],
      slots: ['09:30 AM', '10:00 AM', '11:15 AM'],
      isActive: true,
      bio: 'Expert in infectious diseases and primary care with a focus on rural health outreach.',
      avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=400&q=80',
    },
    {
      id: 'doc-2',
      name: 'Dr. Priya Singh',
      specialty: 'Pediatrician',
      experience: '9 yrs',
      waitTime: '12 min',
      hospital: 'Fortis Hospital',
      rating: 4.8,
      patients: 1780,
      languages: ['English', 'Hindi'],
      slots: ['11:45 AM', '12:30 PM', '02:00 PM'],
      isActive: true,
      bio: 'Specialist in child nutrition and remote vaccination programs for rural communities.',
      avatar: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=400&q=80',
    },
    {
      id: 'doc-3',
      name: 'Dr. Amit Patel',
      specialty: 'Cardiologist',
      experience: '15 yrs',
      waitTime: '20 min',
      hospital: 'Apollo Hospital',
      rating: 4.7,
      patients: 3100,
      languages: ['English', 'Gujarati', 'Hindi'],
      slots: ['03:00 PM', '04:15 PM', '05:30 PM'],
      isActive: false,
      bio: 'Cardiac specialist focusing on lifestyle counseling and rehabilitation.',
      avatar: 'https://images.unsplash.com/photo-1550831107-1553da8c8464?auto=format&fit=crop&w=400&q=80',
    },
    {
      id: 'doc-4',
      name: 'Dr. Meera Patel',
      specialty: 'Telemedicine Specialist',
      experience: '11 yrs',
      waitTime: '8 min',
      hospital: 'Narayana Health',
      rating: 5.0,
      patients: 2560,
      languages: ['English', 'Kannada'],
      slots: ['08:30 AM', '09:00 AM', '10:30 AM'],
      isActive: true,
      bio: 'Telemedicine expert delivering high-quality care to remote regions.',
      avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80',
    },
  ];

  const filteredDoctors =
    doctorFilter === 'all' ? doctors : doctors.filter((doc) => doc.isActive);

  const handleBookAppointment = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setAppointmentForm({
      date: '',
      time: doctor.slots[0] || '',
      mode: 'video',
      reason: '',
    });
    setStep('appointment');
  };

  const handleConfirmAppointment = () => {
    if (!appointmentForm.date || !appointmentForm.time || !selectedDoctor) return;
    setSelectedMode(appointmentForm.mode);
    setStep('waiting');
  };

  if (step === 'options') {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <div className="text-4xl mb-4">📞</div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Remote Consultation
          </h2>
          <p className="text-muted-foreground">
            Connect with healthcare professionals
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="font-bold text-foreground mb-4">Select consultation mode:</h3>
          {modes.map((mode) => (
            <button
              key={mode.id}
              onClick={() => {
                setSelectedMode(mode.id as 'video' | 'audio');
                setStep('waiting');
              }}
              className="w-full p-4 bg-card border-2 border-border rounded-lg hover:border-primary hover:shadow-lg transition-all text-left"
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl">{mode.icon}</span>
                <div>
                  <div className="font-bold text-foreground">{mode.label}</div>
                  <div className="text-sm text-muted-foreground">{mode.desc}</div>
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6 space-y-5 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">Experts online</p>
              <h3 className="text-2xl font-bold text-foreground">Choose your doctor</h3>
            </div>
            <div className="bg-slate-100 dark:bg-slate-800 rounded-full p-1 flex">
              <button
                onClick={() => setDoctorFilter('active')}
                className={`px-4 py-1.5 text-sm font-semibold rounded-full transition-all ${
                  doctorFilter === 'active'
                    ? 'bg-white dark:bg-slate-900 shadow text-primary'
                    : 'text-muted-foreground'
                }`}
              >
                Active Doctors
              </button>
              <button
                onClick={() => setDoctorFilter('all')}
                className={`px-4 py-1.5 text-sm font-semibold rounded-full transition-all ${
                  doctorFilter === 'all'
                    ? 'bg-white dark:bg-slate-900 shadow text-primary'
                    : 'text-muted-foreground'
                }`}
              >
                All Doctors
              </button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {filteredDoctors.map((doc) => (
              <div
                key={doc.id}
                className="group relative p-5 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 bg-gradient-to-br from-slate-50/80 to-white/40 dark:from-slate-900/60 dark:to-slate-900/20 hover:border-primary/60 hover:shadow-2xl transition-all"
              >
                <div className="flex items-start gap-4">
                  <img
                    src={doc.avatar}
                    alt={doc.name}
                    className="w-16 h-16 rounded-2xl object-cover border-4 border-white shadow-lg"
                    loading="lazy"
                  />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-lg text-foreground">{doc.name}</h4>
                      {doc.isActive && (
                        <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/20 text-emerald-600">
                          Active
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{doc.specialty} • {doc.experience}</p>
                    <p className="text-xs text-muted-foreground">{doc.hospital}</p>
                    <div className="flex flex-wrap gap-3 pt-2 text-xs text-muted-foreground">
                      <span>⭐ {doc.rating.toFixed(1)}</span>
                      <span>👥 {doc.patients}+ patients</span>
                      <span>🕑 Wait {doc.waitTime}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-4">
                  {doc.languages.map((lang) => (
                    <span
                      key={lang}
                      className="px-3 py-1 text-xs rounded-full bg-primary/10 text-primary font-semibold"
                    >
                      {lang}
                </span>
                  ))}
                </div>
                <div className="flex items-center gap-3 mt-5">
                  <button
                    onClick={() => handleBookAppointment(doc)}
                    className="flex-1 py-3 rounded-xl bg-gradient-to-r from-primary via-accent to-secondary text-white font-bold text-sm hover:shadow-xl transition-all"
                  >
                    Book Appointment
                  </button>
                  <button
                    onClick={() => setDetailsDoctor(doc)}
                    className="flex-1 py-3 rounded-xl border border-slate-200 dark:border-slate-700 font-bold text-sm text-foreground hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {detailsDoctor && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200/60 dark:border-slate-800/60">
              <div className="flex items-start gap-4">
                <img
                  src={detailsDoctor.avatar}
                  alt={detailsDoctor.name}
                  className="w-20 h-20 rounded-2xl object-cover border-4 border-white shadow-xl"
                />
                <div>
                  <p className="text-xs uppercase tracking-widest text-primary">Doctor profile</p>
                  <h3 className="text-2xl font-bold text-foreground">{detailsDoctor.name}</h3>
                  <p className="text-sm text-muted-foreground">{detailsDoctor.specialty} • {detailsDoctor.experience}</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{detailsDoctor.bio}</p>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="p-3 rounded-2xl bg-primary/5 border border-primary/20">
                  <p className="text-xs text-muted-foreground">Hospital</p>
                  <p className="font-semibold">{detailsDoctor.hospital}</p>
                </div>
                <div className="p-3 rounded-2xl bg-emerald-500/5 border border-emerald-500/20">
                  <p className="text-xs text-muted-foreground">Rating</p>
                  <p className="font-semibold">⭐ {detailsDoctor.rating.toFixed(1)}</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-widest mb-2">Available Slots</p>
                <div className="flex flex-wrap gap-2">
                  {detailsDoctor.slots.map((slot) => (
                    <span key={slot} className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-foreground">
                      {slot}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => {
                    handleBookAppointment(detailsDoctor);
                    setDetailsDoctor(null);
                  }}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-primary to-accent text-white font-bold"
                >
                  Book Appointment
                </button>
                <button
                  onClick={() => setDetailsDoctor(null)}
                  className="flex-1 py-3 rounded-xl border border-slate-200 dark:border-slate-700 font-bold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (step === 'appointment' && selectedDoctor) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setStep('options')}
            className="px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800 text-sm font-semibold"
          >
            ← Doctor List
          </button>
          <p className="text-xs uppercase tracking-widest text-primary">Appointment</p>
        </div>

        <div className="p-6 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-800/60 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <img
              src={selectedDoctor.avatar}
              alt={selectedDoctor.name}
              className="w-20 h-20 rounded-2xl object-cover border-4 border-white shadow-xl"
            />
            <div>
              <h2 className="text-2xl font-bold text-foreground">{selectedDoctor.name}</h2>
              <p className="text-sm text-muted-foreground">{selectedDoctor.specialty} • {selectedDoctor.experience}</p>
              <p className="text-xs text-muted-foreground mt-1">Wait time approx. {selectedDoctor.waitTime}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Select Date</label>
              <input
                type="date"
                value={appointmentForm.date}
                onChange={(e) => setAppointmentForm({ ...appointmentForm, date: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-background text-foreground"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Preferred Time</label>
              <select
                value={appointmentForm.time}
                onChange={(e) => setAppointmentForm({ ...appointmentForm, time: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-background text-foreground"
              >
                <option value="">Select a slot</option>
                {selectedDoctor.slots.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Consultation Mode</label>
              <div className="grid grid-cols-2 gap-3">
                {modes.map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => setAppointmentForm({ ...appointmentForm, mode: mode.id as 'video' | 'audio' })}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      appointmentForm.mode === mode.id
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-slate-200 dark:border-slate-700 text-foreground'
                    }`}
                  >
                    <p className="text-2xl">{mode.icon}</p>
                    <p className="font-semibold">{mode.label}</p>
                    <p className="text-xs text-muted-foreground">{mode.desc}</p>
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Reason / Symptoms</label>
              <textarea
                value={appointmentForm.reason}
                onChange={(e) => setAppointmentForm({ ...appointmentForm, reason: e.target.value })}
                rows={4}
                placeholder="Describe your symptoms briefly"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-background text-foreground"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={handleConfirmAppointment}
              disabled={!appointmentForm.date || !appointmentForm.time}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-primary via-accent to-secondary text-white font-bold disabled:opacity-50"
            >
              Confirm Appointment
            </button>
            <button
              onClick={() => setStep('options')}
              className="flex-1 py-3 rounded-xl border border-slate-200 dark:border-slate-700 font-bold"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'waiting') {
    const doctor = selectedDoctor || doctors[0];
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <div className="text-4xl mb-4 animate-bounce">⏳</div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Connecting you...
          </h2>
          <p className="text-muted-foreground">
            Your consultation request with {doctor.name} has been scheduled
          </p>
        </div>

        <div className="p-6 bg-card border-2 border-border rounded-lg space-y-4">
          <h3 className="font-bold text-foreground">Pre-Consultation Summary:</h3>

          <div className="space-y-3">
            <div className="bg-muted p-3 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Doctor</p>
              <p className="font-semibold text-foreground">{doctor.name}</p>
              <p className="text-xs text-muted-foreground">{doctor.specialty}</p>
            </div>

            <div className="bg-muted p-3 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Consultation Mode</p>
              <p className="font-semibold text-foreground">
                {selectedMode === 'audio' ? '📱 Audio Call' : '📹 Video Call'}
              </p>
            </div>

            <div className="bg-muted p-3 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Preferred Slot</p>
              <p className="font-semibold text-foreground">
                {appointmentForm.date || 'Select date'} • {appointmentForm.time || 'Select time'}
              </p>
            </div>

            <div className="bg-muted p-3 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Notes for Doctor</p>
              <p className="font-semibold text-foreground">
                {appointmentForm.reason?.trim() ? appointmentForm.reason : 'You can add notes anytime'}
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => setStep('active')}
          className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-bold hover:bg-primary/90"
        >
          Doctor Ready - Start Consultation
        </button>

        <button
          onClick={() => setStep('options')}
          className="w-full py-3 bg-muted text-muted-foreground rounded-lg font-bold hover:bg-muted/80"
        >
          Cancel
        </button>
      </div>
    );
  }

  if (step === 'active') {
    return (
      <div className="space-y-6">
        {/* Video/Audio Frame */}
        <div className="relative bg-muted rounded-lg overflow-hidden aspect-video flex items-center justify-center border-2 border-border">
          <div className="text-center">
            <div className="text-6xl mb-4">👨‍⚕️</div>
            <p className="font-bold text-foreground">Dr. Rajesh Kumar</p>
            <p className="text-sm text-muted-foreground">Connected</p>
          </div>

          {/* Timer */}
          <div className="absolute top-4 right-4 bg-destructive text-destructive-foreground px-3 py-1 rounded-full text-sm font-bold">
            {Math.floor(sessionTime / 60)}:{(sessionTime % 60).toString().padStart(2, '0')}
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-3 justify-center">
          <button className="p-4 bg-primary text-primary-foreground rounded-full hover:bg-primary/90">
            🎤
          </button>
          <button className="p-4 bg-secondary text-secondary-foreground rounded-full hover:bg-secondary/90">
            📹
          </button>
          <button className="p-4 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90">
            📞
          </button>
        </div>

        {/* Image Upload */}
        <div className="bg-card border-2 border-border rounded-lg p-4">
          <p className="font-bold text-foreground mb-3">Share Medical Images</p>
          <input
            type="file"
            multiple
            accept="image/*"
            className="w-full text-sm"
            onChange={(e) => {
              if (e.target.files) {
                setUploadedImages(Array.from(e.target.files).map((f) => f.name));
              }
            }}
          />
          {uploadedImages.length > 0 && (
            <p className="text-xs text-primary mt-2">{uploadedImages.length} image(s) uploaded</p>
          )}
        </div>

        {/* Chat/Notes */}
        <div className="bg-card border-2 border-border rounded-lg p-4">
          <p className="font-bold text-foreground mb-3">Consultation Notes</p>
          <textarea
            value={sessionNotes}
            onChange={(e) => setSessionNotes(e.target.value)}
            placeholder="Doctor's notes and recommendations will appear here..."
            className="w-full p-3 bg-background border border-border rounded text-foreground text-sm resize-none"
            rows={4}
          />
        </div>

        <button
          onClick={() => setStep('summary')}
          className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-bold hover:bg-primary/90"
        >
          End Consultation
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center py-8">
        <div className="text-4xl mb-4">✅</div>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Consultation Complete
        </h2>
        <p className="text-muted-foreground">Thank you for using our service</p>
      </div>

      <div className="space-y-4">
        {/* Summary Card */}
        <div className="p-6 bg-card border-2 border-border rounded-lg space-y-4">
          <h3 className="font-bold text-foreground text-lg">Consultation Summary</h3>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-muted p-3 rounded-lg">
              <p className="text-xs text-muted-foreground">Doctor</p>
              <p className="font-semibold text-foreground text-sm">Dr. Rajesh Kumar</p>
            </div>
            <div className="bg-muted p-3 rounded-lg">
              <p className="text-xs text-muted-foreground">Duration</p>
              <p className="font-semibold text-foreground text-sm">12 minutes</p>
            </div>
          </div>

          <div className="bg-muted p-3 rounded-lg">
            <p className="text-xs text-muted-foreground mb-2">Recommendations</p>
            <ul className="text-sm text-foreground space-y-1">
              <li>✓ Rest for 2-3 days</li>
              <li>✓ Drink plenty of water</li>
              <li>✓ Take prescribed medication</li>
              <li>✓ Follow-up in 1 week</li>
            </ul>
          </div>
        </div>

        {/* Prescription */}
        <div className="p-6 bg-secondary/10 border-2 border-secondary rounded-lg">
          <h3 className="font-bold text-foreground mb-3">Prescribed Medications</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-foreground">Paracetamol 500mg</span>
              <span className="text-muted-foreground">2x daily</span>
            </div>
            <div className="flex justify-between">
              <span className="text-foreground">Cough Syrup</span>
              <span className="text-muted-foreground">3x daily</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2">
          <button className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-bold hover:bg-primary/90">
            📥 Download Report
          </button>
          <button
            onClick={() => setStep('options')}
            className="w-full py-3 bg-muted text-muted-foreground rounded-lg font-bold hover:bg-muted/80"
          >
            Book Another Consultation
          </button>
        </div>
      </div>
    </div>
  );
}
