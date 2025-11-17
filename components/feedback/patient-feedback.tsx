'use client';

import { useState } from 'react';

interface Feedback {
  id: string;
  rating: number;
  category: 'app' | 'doctor' | 'both';
  title: string;
  message: string;
  date: string;
}

export default function PatientFeedback({ onBack }: { onBack?: () => void }) {
  const [feedbackList, setFeedbackList] = useState<Feedback[]>([
    {
      id: '1',
      rating: 5,
      category: 'app',
      title: 'Great app',
      message: 'Very helpful for tracking my health',
      date: 'Dec 10, 2024',
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    rating: 5,
    category: 'app' as const,
    title: '',
    message: '',
  });

  const handleSubmit = () => {
    if (!formData.title.trim() || !formData.message.trim()) {
      alert('Please fill in all fields');
      return;
    }

    const newFeedback: Feedback = {
      id: Date.now().toString(),
      rating: formData.rating,
      category: formData.category,
      title: formData.title,
      message: formData.message,
      date: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }),
    };

    setFeedbackList([newFeedback, ...feedbackList]);
    setFormData({ rating: 5, category: 'app', title: '', message: '' });
    setShowForm(false);
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return 'text-secondary';
    if (rating >= 3) return 'text-accent';
    return 'text-destructive';
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto">
        {onBack && (
          <button
            onClick={onBack}
            className="text-primary font-semibold text-sm flex items-center gap-1 hover:text-primary/80 mb-4"
          >
            ← Back
          </button>
        )}

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-foreground mb-2">Your Feedback</h2>
          <p className="text-muted-foreground">Help us improve by sharing your experience</p>
        </div>

        {!showForm ? (
          <button
            onClick={() => setShowForm(true)}
            className="w-full py-4 bg-primary text-primary-foreground rounded-lg font-bold text-lg hover:bg-primary/90 mb-6"
          >
            + Add New Feedback
          </button>
        ) : (
          <div className="p-6 bg-card border-2 border-border rounded-lg mb-6 space-y-4">
            <h3 className="font-bold text-foreground text-lg">Share Your Feedback</h3>

            <div>
              <label className="block text-sm font-bold text-foreground mb-2">
                Rate Your Experience
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setFormData({ ...formData, rating: star })}
                    className={`text-4xl transition-transform ${
                      star <= formData.rating ? 'scale-110' : 'opacity-50'
                    }`}
                  >
                    ⭐
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-foreground mb-2">
                Feedback About
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['app', 'doctor', 'both'] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setFormData({ ...formData, category: cat })}
                    className={`py-2 px-3 rounded-lg font-semibold text-sm transition-all ${
                      formData.category === cat
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    {cat === 'app' ? 'App' : cat === 'doctor' ? 'Doctor' : 'Both'}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-foreground mb-2">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Brief title for your feedback"
                className="w-full px-4 py-3 rounded-lg border-2 border-border bg-background text-foreground"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-foreground mb-2">
                Detailed Feedback
              </label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Tell us what you think..."
                className="w-full px-4 py-3 rounded-lg border-2 border-border bg-background text-foreground resize-none"
                rows={5}
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleSubmit}
                className="flex-1 py-3 bg-primary text-primary-foreground rounded-lg font-bold hover:bg-primary/90"
              >
                Submit Feedback
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="flex-1 py-3 bg-muted text-muted-foreground rounded-lg font-bold hover:bg-muted/80"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <h3 className="font-bold text-foreground text-lg">Recent Feedback</h3>
          {feedbackList.map((feedback) => (
            <div key={feedback.id} className="p-4 bg-card border-2 border-border rounded-lg">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="font-bold text-foreground">{feedback.title}</h4>
                  <p className="text-xs text-muted-foreground">{feedback.date}</p>
                </div>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={`text-lg ${
                        i < feedback.rating ? 'opacity-100' : 'opacity-30'
                      }`}
                    >
                      ⭐
                    </span>
                  ))}
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-2">{feedback.message}</p>
              <span
                className={`inline-block text-xs font-bold px-3 py-1 rounded ${
                  feedback.category === 'app'
                    ? 'bg-primary/20 text-primary'
                    : feedback.category === 'doctor'
                      ? 'bg-secondary/20 text-secondary'
                      : 'bg-accent/20 text-accent'
                }`}
              >
                {feedback.category === 'app'
                  ? 'App Feedback'
                  : feedback.category === 'doctor'
                    ? 'Doctor Feedback'
                    : 'General Feedback'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
