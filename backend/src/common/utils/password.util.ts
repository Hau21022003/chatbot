export function validatePasswordStrength(password: string): string[] {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Must be at least 8 characters');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Must contain at least one uppercase letter');
  }

  if (!/[0-9]/.test(password)) {
    errors.push('Must contain at least one number');
  }

  if (!/[^A-Za-z0-9]/.test(password)) {
    errors.push('Must contain at least one special character');
  }

  return errors;
}
