import React, { useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import classnames from 'classnames/bind';
import { useRouter } from 'next/router';

import Cta from 'components/cta';
import ContactUs from 'components/contactUs';
import ContentSection from 'components/contentSection';
import Hero from 'components/hero';
import Layout from 'components/layout';
import NewsletterBanner from 'components/newsletter';
import { ROUTE_VOLUNTEER } from 'routes';

import styles from './index.module.scss';
const cx = classnames.bind(styles);

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, [
      'common',
      'form',
      'home',
      'menu',
      'newsletter',
    ])),
  },
});

const Home = () => {
  const { t } = useTranslation('home');

  return (
    <Layout withContentPadding={false}>
      <div className={cx('wrapper')}>
        <Hero />
        <ContentSection
          anchorId="how"
          className={cx('how')}
          title={t('how.title')}
          content={t('how.content')}
        />
        <NewsletterBanner
          className={cx('newsletter')}
          heading={t('newsletter.heading')}
          description={t('newsletter.description')}
        />
        <ContentSection
          anchorId="about"
          className={cx('about')}
          title={t('about.title')}
          content={t('about.content')}
        >
          <Cta
            className={cx('volunteerBtn')}
            text={t('volunteerBtn')}
            to={ROUTE_VOLUNTEER}
          />
          <ContactUs className={cx('contact')} translation="home" />
        </ContentSection>
      </div>
    </Layout>
  );
};

export default Home;
