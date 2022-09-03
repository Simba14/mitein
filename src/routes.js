export const ROUTE_BASE = '/';
export const ROUTE_BASE_DE = '/de/';
export const ROUTE_BASE_EN = '/en/';
export const ROUTE_ABOUT = '/#about';
export const ROUTE_FORGOT_PASSWORD = '/forgot-password';
export const ROUTE_HOW = '/#how';
export const ROUTE_LOGIN = '/login/';
export const ROUTE_ONBOARDING = '/onboarding/';
export const ROUTE_PRIVACY = '/privacy/';
export const ROUTE_PROFILE = '/profile/';
export const ROUTE_RESET_PASSWORD = '/reset-password/';
export const ROUTE_CHATS_BOOK = '/chats/book';
export const ROUTE_CHATS_REBOOK = '/chats/rebook';
export const ROUTE_SIGN_UP = '/sign-up/';
export const ROUTE_TERMS = '/terms/';
export const ROUTE_VOLUNTEER = '/volunteer/';
export const ROUTE_VERIFY_EMAIL = '/verify-email/';

export const getUniquePath = ({ base, slug }) => `${base}/${slug}/`;
