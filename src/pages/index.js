import React from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import Cta from 'components/cta';
import ContactUs from 'components/contactUs';
import ContentSection from 'components/contentSection';
import Hero from 'components/hero';
import Layout from 'components/layout';
import NewsletterBanner from 'components/newsletter';
import { ROUTE_VOLUNTEER } from 'routes';

import styles from './index.module.scss';

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, [
      'home',
      'form',
      'header',
      'menu',
      'newsletter',
    ])),
  },
});

const Home = () => {
  const { t } = useTranslation('home');

  return (
    <Layout withContentPadding={false}>
      <div className={`${styles.wrapper}`}>
        <Hero />
        <ContentSection
          anchorId="how"
          className={styles.how}
          translation="home"
          withKey="how"
        ></ContentSection>
        <NewsletterBanner
          className={styles.newsletter}
          heading={t('newsletter.heading')}
          description={t('newsletter.description')}
        />
        <ContentSection
          anchorId="about"
          className={styles.about}
          translation="home"
          withKey="about"
        >
          <Cta
            className={styles.volunteerBtn}
            text={t('volunteerBtn')}
            to={ROUTE_VOLUNTEER}
          />
          <ContactUs className={styles.contact} translation="home" />
        </ContentSection>
      </div>
    </Layout>
  );
};

export default Home;
