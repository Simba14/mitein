export const MOCK_CLASSNAME = 'classname';
export const MOCK_TEXT = 'Great content';
export const MOCK_TITLE = 'Title';
export const MOCK_ID = 'mock-id';
export const MOCK_URL = 'www.mitein.de';
export const MOCK_EMAIL = 'user@mitein.de';
export const MOCK_SLUG = '/home';
export const MOCK_ERROR = 'user already exists';
export const MOCK_START_UTC = '2022-02-18T13:00:00.000Z';
export const MOCK_START_SHORT = '18/02/2022';
export const MOCK_START_EN = 'Friday, 18 February 2022';
export const MOCK_START_DE = 'Freitag, 18. Februar 2022';
export const MOCK_END_UTC = '2022-02-18T13:30:00.000Z';
export const MOCK_TIME_EN = '14:00 - 14:30 CET';
export const MOCK_TIME_DE = '14:00 - 14:30 MEZ';
export const MOCK_CHAT_TYPE = 'VIDEO';

export const MOCK_SESSION_VARS = {
  cookieConsentRecordedIdentifier: 'cookieConsentRecordedIdentifier',
  cookieUserIdExpireDays: 365,
  cookieUserIdIdentifier: 'cookieUserIdIdentifier',
};

export const MOCK_CHAT = {
  id: MOCK_ID,
  start: MOCK_START_UTC,
  end: MOCK_END_UTC,
  link: MOCK_URL,
  participant1Id: MOCK_ID,
  type: MOCK_CHAT_TYPE,
};

export const getMockChat = ({ status, ...other }) => ({
  ...MOCK_CHAT,
  ...other,
  status: status,
});

export const mockT = string => string;
