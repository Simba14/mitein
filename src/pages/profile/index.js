import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, [
      'profile',
      'calendar',
      'session',
      'header',
      'menu',
    ])),
  },
});

export { default } from './profile';
