import breakpoints from 'constants/breakpoints';
import { GERMAN } from 'constants/defaultOptions';

export const getIsMobile = (width) => width <= breakpoints.mobile;

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

export const formatSessionTime = (session) => {
  const start = new Date(session.start);
  const end = new Date(session.end);

  return `${start.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  })} - ${end.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short',
  })}`;
};
