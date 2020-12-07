import { ROUTE_LOGIN, ROUTE_SIGN_UP } from '../../routes';

export default {
  email: 'Email',
  password: 'Passwort',
  confirmPassword: 'Passwort Bestätigen',
  accountType: {
    label: 'Ich...',
    learner: 'lerne Deutsch',
    native: 'bin Muttersprachler',
    representative: 'bin ein Vertreter',
  },
  signUp: {
    submitBtn: 'Anmelden',
    changeLocation: {
      text: 'Sie sind bereits Mitglied?',
      route: ROUTE_LOGIN,
      cta: 'Hier einloggen',
    },
  },
  login: {
    submitBtn: 'Einloggen',
    changeLocation: {
      text: 'Neu bei?',
      route: ROUTE_SIGN_UP,
      cta: 'Hier anmelden',
    },
  },
};
