'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export type SupportedLanguage = 
  | 'en-US'
  | 'hi-IN'
  | 'bn-IN'
  | 'te-IN'
  | 'ta-IN'
  | 'mr-IN'
  | 'gu-IN'
  | 'ur-IN'
  | 'kn-IN'
  | 'ml-IN'
  | 'ne-NP'
  | 'hi-CG';

export const LANGUAGE_MAP: Record<SupportedLanguage, string> = {
  'en-US': 'English',
  'hi-IN': 'Hindi',
  'bn-IN': 'Bengali',
  'te-IN': 'Telugu',
  'ta-IN': 'Tamil',
  'mr-IN': 'Marathi',
  'gu-IN': 'Gujarati',
  'ur-IN': 'Urdu',
  'kn-IN': 'Kannada',
  'ml-IN': 'Malayalam',
  'ne-NP': 'Nepali',
  'hi-CG': 'Chhattisgarhi',
};

interface LanguageSelectorProps {
  value: SupportedLanguage;
  onChange: (language: SupportedLanguage) => void;
  disabled?: boolean;
}

export function LanguageSelector({ value, onChange, disabled }: LanguageSelectorProps) {
  return (
    <Select value={value} onValueChange={(val) => onChange(val as SupportedLanguage)} disabled={disabled}>
      <SelectTrigger className="w-32 h-9">
        <SelectValue placeholder="Select language" />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(LANGUAGE_MAP).map(([code, name]) => (
          <SelectItem key={code} value={code}>
            {name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
