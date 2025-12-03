import { AppLanguage } from '../services/shared/lang/lang.interfaces';

export const formatDateByLang = (
  date: Date | string,
  lang: AppLanguage,
  includeTime = false,
): string => {
  const timezoneOffsetInMinutes = new Date().getTimezoneOffset();
  const parsedDate = new Date(
    new Date(date).getTime() + timezoneOffsetInMinutes * 60 * 1000,
  );
  const locale = lang === AppLanguage.ENGLISH ? 'en-US' : 'es-ES';

  if (includeTime) {
    const options: Intl.DateTimeFormatOptions = {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    return parsedDate.toLocaleDateString(locale, options);
  }

  const options: Intl.DateTimeFormatOptions = {
    month: 'long',
    day: '2-digit',
    year: '2-digit',
  };
  return parsedDate.toLocaleDateString(locale, options);
};

export const formatDate = (
  date: Date | string,
  includeTime = false,
): string => {
  const timezoneOffsetInMinutes = new Date().getTimezoneOffset();
  const parsedDate = new Date(
    new Date(date).getTime() + timezoneOffsetInMinutes * 60 * 1000,
  );

  if (includeTime) {
    const options: Intl.DateTimeFormatOptions = {
      month: 'numeric',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    };
    return parsedDate.toLocaleDateString('es-ES', options);
  }

  const options: Intl.DateTimeFormatOptions = {
    month: 'numeric',
    day: 'numeric',
    year: 'numeric',
  };
  return parsedDate.toLocaleDateString('es-ES', options);
};
