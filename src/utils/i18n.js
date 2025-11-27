import { getLocales } from 'expo-localization';
import { I18n } from 'i18n-js';

const i18n = new I18n({
  en: {
    schedule: 'Schedule',
    venue: 'Venue Comparison',
    budget: 'Budget',
    welcome: 'Welcome to Oji Wedding',
    currency: 'Currency',
  },
  ko: {
    schedule: '일정 관리',
    venue: '예식장 비교',
    budget: '예산 관리',
    welcome: '오지 웨딩에 오신 것을 환영합니다',
    currency: '통화',
  },
});

// Set the locale once at the beginning of your app.
i18n.locale = getLocales()[0].languageCode;
i18n.enableFallback = true;

/**
 * Formats a number as Korean Won (KRW).
 * @param {number} amount - The amount to format.
 * @returns {string} - The formatted string (e.g., "₩1,000,000").
 */
export const formatKRW = (amount) => {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
  }).format(amount);
};

export default i18n;
