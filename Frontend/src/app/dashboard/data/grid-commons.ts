export function validateCellStyle(
  isValid: (value: string) => boolean,
  value: string
): { backgroundColor: string; border: string } {
  const error = { backgroundColor: '#FFE0E0', border: '2px solid #FAA' };
  const normal = { backgroundColor: '', border: '' };

  return isValid(value) ? normal : error;
}

export function toottipText(
  isValid: (value: string) => boolean,
  value: string
): string | null {
  if (!isValid(value)) {
    return 'Wartość nie jest poprawnym adresem email.';
  }
  return null;
}