import {
  formatSessionDate,
  formatSessionTime,
  isSpecifiedBreakpoint,
} from './index';
import breakpoints, { MOBILE } from '@constants/breakpoints';
import { ENGLISH, GERMAN } from '@constants/defaultOptions';
import {
  MOCK_START_EN,
  MOCK_START_DE,
  MOCK_START_UTC,
  MOCK_END_UTC,
  MOCK_TIME_EN,
  MOCK_TIME_DE,
} from 'unitTests/sharedMocks';

describe('isSpecifiedBreakpoint', () => {
  test('returns true when width is at mobile breakpoint', () => {
    expect(
      isSpecifiedBreakpoint({
        breakpoint: MOBILE,
        width: breakpoints.mobile,
      }),
    ).toBe(true);
  });

  test('returns true when width is less than mobile breakpoint', () => {
    expect(
      isSpecifiedBreakpoint({
        breakpoint: MOBILE,
        width: breakpoints.mobile,
      }),
    ).toBe(true);
  });

  test('returns false when width is greater than mobile breakpoint', () => {
    expect(
      isSpecifiedBreakpoint({
        breakpoint: MOBILE,
        width: breakpoints.tablet,
      }),
    ).toBe(false);
  });
});

describe('formatSessionDate', () => {
  test('returns correct date when German locale provided', () => {
    expect(formatSessionDate(MOCK_START_UTC, GERMAN)).toBe(MOCK_START_DE);
  });

  test('returns correct date when English locale provided', () => {
    expect(formatSessionDate(MOCK_START_UTC, ENGLISH)).toBe(MOCK_START_EN);
  });
});

describe('formatSessionTime', () => {
  test('returns correctly formatted time when English language', () => {
    expect(
      formatSessionTime({
        start: MOCK_START_UTC,
        end: MOCK_END_UTC,
        language: ENGLISH,
      }),
    ).toBe(MOCK_TIME_EN);
  });

  test('returns correctly formatted time when German language', () => {
    expect(
      formatSessionTime({
        start: MOCK_START_UTC,
        end: MOCK_END_UTC,
        language: GERMAN,
      }),
    ).toBe(MOCK_TIME_DE);
  });
});
