import { RESERVED_USERNAMES } from '@/lib/db/seed/seed-data';

// Homoglyphs map to normalize lookalike Latin / Cyrillic / Greek characters
const HOMOGLYPHS: Record<string, string> = {
  'а': 'a', 'о': 'o', 'е': 'e', 'р': 'p', 'с': 'c', 'у': 'y', 'х': 'x',
  'і': 'i', 'ј': 'j', 'ѕ': 's', 'ѵ': 'v', '0': 'o', '1': 'l', '3': 'e',
  '4': 'a', '5': 's', '@': 'a', '$': 's'
};

const PROFANITY_LIST = [
  'nigger', 'faggot', 'kike', 'chink', 'spic', 'retard'
];

export function normalizeUsername(raw: string): string {
  let normalized = raw.trim().toLowerCase();
  for (const [variant, target] of Object.entries(HOMOGLYPHS)) {
    normalized = normalized.replaceAll(variant, target);
  }
  return normalized;
}

export interface UsernameValidationResult {
  valid: boolean;
  error?: string;
}

export function validateUsername(username: string): UsernameValidationResult {
  const trimmed = username.trim().toLowerCase();

  if (trimmed.length < 3) {
    return { valid: false, error: 'Username must be at least 3 characters long.' };
  }

  if (trimmed.length > 24) {
    return { valid: false, error: 'Username cannot exceed 24 characters.' };
  }

  if (!/^[a-z0-9_.-]+$/.test(trimmed)) {
    return { valid: false, error: 'Username can only contain alphanumeric characters, underscores, dashes, and periods.' };
  }

  if (trimmed.startsWith('.') || trimmed.endsWith('.') || trimmed.startsWith('-') || trimmed.endsWith('-')) {
    return { valid: false, error: 'Username cannot begin or end with punctuation.' };
  }

  if (RESERVED_USERNAMES.includes(trimmed)) {
    return { valid: false, error: 'This username is reserved by SILENT.BIO.' };
  }

  const normalized = normalizeUsername(trimmed);
  for (const word of PROFANITY_LIST) {
    if (normalized.includes(word)) {
      return { valid: false, error: 'Username contains prohibited words or slurs.' };
    }
  }

  return { valid: true };
}
