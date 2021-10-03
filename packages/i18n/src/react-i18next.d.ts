import 'react-i18next';
import enGB from './locales/en-GB.json';

declare module 'react-i18next' {
  interface CustomTypeOptions {
    resources: {
      translation: typeof enGB;
    };
  }
}
