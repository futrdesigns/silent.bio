/**
 * SILENT.BIO CSS Sandboxing Engine
 * Hard limits: Max 8KB, scopes all rules to .silent-profile-root,
 * strips @import, url(), expression, -moz-binding, and forbidden properties.
 */

const MAX_CSS_BYTES = 8192; // 8 KB

const FORBIDDEN_PATTERNS = [
  /@import/i,
  /url\s*\(/i,
  /expression\s*\(/i,
  /behavior\s*:/i,
  /-moz-binding\s*:/i,
  /javascript\s*:/i,
  /<script/i,
  /<\/style>/i,
  /position\s*:\s*fixed/i, // prevent viewport spoofing
];

export interface CssSanitizeResult {
  safe: boolean;
  sanitizedCss: string;
  error?: string;
}

export function sanitizeCustomCss(rawCss: string, scopeClass = '.silent-profile-root'): CssSanitizeResult {
  if (!rawCss || rawCss.trim() === '') {
    return { safe: true, sanitizedCss: '' };
  }

  const byteLength = new TextEncoder().encode(rawCss).length;
  if (byteLength > MAX_CSS_BYTES) {
    return {
      safe: false,
      sanitizedCss: '',
      error: `CSS exceeds the 8 KB limit (current: ${(byteLength / 1024).toFixed(1)} KB).`,
    };
  }

  for (const pattern of FORBIDDEN_PATTERNS) {
    if (pattern.test(rawCss)) {
      return {
        safe: false,
        sanitizedCss: '',
        error: `Custom CSS contains forbidden statements (disallowed: @import, url(), external fetches, fixed positions).`,
      };
    }
  }

  // Prefix CSS selectors with the profile scope class
  // Simple robust parser splitting on closing braces
  try {
    const rules = rawCss.split('}');
    const scopedRules: string[] = [];

    for (const rule of rules) {
      const parts = rule.split('{');
      if (parts.length === 2) {
        const selector = parts[0].trim();
        const body = parts[1].trim();

        if (selector && body) {
          // Prefix comma-separated sub-selectors
          const scopedSelector = selector
            .split(',')
            .map((s) => `${scopeClass} ${s.trim()}`)
            .join(', ');

          scopedRules.push(`${scopedSelector} { ${body} }`);
        }
      }
    }

    return {
      safe: true,
      sanitizedCss: scopedRules.join('\n'),
    };
  } catch (err) {
    return {
      safe: false,
      sanitizedCss: '',
      error: 'Malformed CSS syntax.',
    };
  }
}
