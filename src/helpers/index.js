import breakpoints from '@constants/breakpoints';
import { GERMAN } from '@constants/defaultOptions';

export const isSpecifiedBreakpoint = ({ breakpoint, width }) =>
  width <= breakpoints[breakpoint];

const DE_LOCALE = 'de-DE';
const EN_LOCALE = 'en-GB';
const DATE_OPTIONS = {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
};

export const formatSessionDate = (date, locale) =>
  new Date(date).toLocaleDateString(
    locale === GERMAN ? DE_LOCALE : EN_LOCALE,
    DATE_OPTIONS,
  );

export const formatSessionTime = ({ start, end, language }) => {
  const dateStart = new Date(start);
  const dateEnd = new Date(end);
  const locale = language === GERMAN ? DE_LOCALE : EN_LOCALE;

  return `${dateStart.toLocaleTimeString(locale, {
    hour: '2-digit',
    minute: '2-digit',
  })} - ${dateEnd.toLocaleTimeString(locale, {
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short',
  })}`;
};
