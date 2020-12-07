import { ROUTE_LOGIN, ROUTE_SIGN_UP } from '../../routes';

export default {
  email: 'Email',
  password: 'Password',
  confirmPassword: 'Confirm Password',
  accountType: {
    label: 'I Am...',
    learner: 'Learning German',
    native: 'a Native Speaker',
    representative: 'Representative',
  },
  signUp: {
    submitBtn: 'Sign Up',
    changeLocation: {
      text: 'Already a member?',
      route: ROUTE_LOGIN,
      cta: 'Login here',
    },
  },
  login: {
    submitBtn: 'Login',
    changeLocation: {
      text: 'New to Mitein?',
      route: ROUTE_SIGN_UP,
      cta: 'Sign up here',
    },
  },
};
