
import { MOCK_LOCALES } from '../constants';
import { LocaleInfo } from '../types';

export function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}

// Helper to get locale information based on browser language
export function getLocaleInfo(): LocaleInfo {
  const lang = navigator.language || 'fr-FR';
  return MOCK_LOCALES[lang] || MOCK_LOCALES['fr-FR'];
}

// Helper to format price based on locale rate
export function formatPrice(price: number, locale: LocaleInfo): string {
  return (price * locale.rate).toFixed(2);
}
