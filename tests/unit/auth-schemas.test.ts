import { describe, it, expect } from 'vitest';
import { registerSchema, loginSchema } from '../../lib/auth/schemas';

describe('Auth Schemas Validation', () => {
  it('validates correct registration payloads', () => {
    const valid = {
      username: 'alex_99',
      displayName: 'Alex',
      email: 'alex@example.com',
      password: 'StrongPassword1',
    };
    const res = registerSchema.safeParse(valid);
    expect(res.success).toBe(true);
  });

  it('rejects passwords without numbers or uppercase letters', () => {
    const invalid = {
      username: 'alex_99',
      displayName: 'Alex',
      email: 'alex@example.com',
      password: 'weakpassword',
    };
    const res = registerSchema.safeParse(invalid);
    expect(res.success).toBe(false);
  });

  it('rejects invalid emails on login', () => {
    const res = loginSchema.safeParse({ email: 'not-an-email', password: '123' });
    expect(res.success).toBe(false);
  });
});
