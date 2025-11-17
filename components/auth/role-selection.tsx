'use client';

import { ThemeToggle } from '@/components/theme/theme-toggle';
import { useTheme } from '@/components/theme/theme-provider';
import { Heart, Stethoscope, BarChart3, Sparkles, Shield, Zap, Globe } from 'lucide-react';

interface RoleSelectionProps {
  onSelectRole: (role: 'patient' | 'health-worker' | 'admin') => void;
}

export default function RoleSelection({ onSelectRole }: RoleSelectionProps) {
  const { theme, mounted } = useTheme();

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex flex-col items-center justify-center px-4 py-8 md:py-10 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="absolute top-6 right-6 z-10">
        <ThemeToggle />
      </div>

      <div className="max-w-5xl w-full space-y-10 relative z-10 flex flex-col justify-center">
        {/* Header with Hero Section */}
        <div className="text-center space-y-6">
          <div className="flex justify-center mb-2">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-secondary rounded-full blur-xl opacity-40 animate-pulse"></div>
              <div className="relative w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-primary via-accent to-secondary rounded-2xl flex items-center justify-center shadow-2xl">
                <Heart className="w-10 h-10 md:w-12 md:h-12 text-white" fill="currentColor" />
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <h1 className="text-4xl md:text-5xl font-extrabold text-foreground leading-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-secondary">
                HealthCare Hub
              </span>
            </h1>
            <div className="flex items-center justify-center gap-2 text-primary/80">
              <Sparkles className="w-4 h-4" />
              <p className="text-lg md:text-xl font-semibold text-foreground/90">
                Smart Healthcare for Rural Communities
              </p>
              <Sparkles className="w-4 h-4" />
            </div>
            <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              AI-powered diagnosis, remote consultations, and comprehensive health management—all in one unified platform
            </p>
          </div>

          {/* Feature Pills */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <div className="px-4 py-2 bg-primary/10 dark:bg-primary/20 rounded-full border border-primary/20 flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-foreground">AI-Powered</span>
            </div>
            <div className="px-4 py-2 bg-accent/10 dark:bg-accent/20 rounded-full border border-accent/20 flex items-center gap-2">
              <Shield className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium text-foreground">Secure & Private</span>
            </div>
            <div className="px-4 py-2 bg-secondary/10 dark:bg-secondary/20 rounded-full border border-secondary/20 flex items-center gap-2">
              <Globe className="w-4 h-4 text-secondary" />
              <span className="text-sm font-medium text-foreground">Multi-Language</span>
            </div>
          </div>
        </div>

        {/* Role Cards */}
        <div className="grid md:grid-cols-3 gap-5 max-w-4xl mx-auto w-full">
          {/* Patient Card */}
          <button
            onClick={() => onSelectRole('patient')}
            className="group relative p-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/40 dark:border-slate-800/40 rounded-3xl hover:border-primary/60 dark:hover:border-primary/60 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 active:scale-[0.98] overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative space-y-4">
              <div className="w-14 h-14 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                <Heart className="w-7 h-7 text-white" fill="currentColor" />
              </div>
              <div>
                <h3 className="font-bold text-xl text-foreground mb-2">Patient</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Manage your health records, get AI-powered guidance, and access remote consultations
                </p>
              </div>
              <div className="pt-2">
                <span className="text-primary font-semibold text-sm group-hover:translate-x-1 inline-block transition-transform">
                  Get Started →
                </span>
              </div>
            </div>
          </button>

          {/* Health Worker Card */}
          <button
            onClick={() => onSelectRole('health-worker')}
            className="group relative p-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/40 dark:border-slate-800/40 rounded-3xl hover:border-accent/60 dark:hover:border-accent/60 hover:shadow-2xl hover:shadow-accent/10 transition-all duration-300 active:scale-[0.98] overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-accent/0 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative space-y-4">
              <div className="w-14 h-14 bg-gradient-to-br from-accent to-accent/80 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                <Stethoscope className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-xl text-foreground mb-2">Health Worker</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Track patient visits, manage cases, and provide quality healthcare services
                </p>
              </div>
              <div className="pt-2">
                <span className="text-accent font-semibold text-sm group-hover:translate-x-1 inline-block transition-transform">
                  Get Started →
                </span>
              </div>
            </div>
          </button>

          {/* Administrator Card */}
          <button
            onClick={() => onSelectRole('admin')}
            className="group relative p-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/40 dark:border-slate-800/40 rounded-3xl hover:border-secondary/60 dark:hover:border-secondary/60 hover:shadow-2xl hover:shadow-secondary/10 transition-all duration-300 active:scale-[0.98] overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-secondary/0 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative space-y-4">
              <div className="w-14 h-14 bg-gradient-to-br from-secondary to-secondary/80 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                <BarChart3 className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-xl text-foreground mb-2">Administrator</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Oversee system resources, manage approvals, and monitor platform analytics
                </p>
              </div>
              <div className="pt-2">
                <span className="text-secondary font-semibold text-sm group-hover:translate-x-1 inline-block transition-transform">
                  Get Started →
                </span>
              </div>
            </div>
          </button>
        </div>

        {/* Footer */}
        <div className="text-center space-y-4 pt-8 border-t border-slate-200/50 dark:border-slate-800/50">
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Available in: English, Hindi, Chhattisgarhi
            </span>
          </div>
          <p className="text-xs text-muted-foreground/70">
            Developed by ArshXCoder
          </p>
        </div>
      </div>
    </div>
  );
}
