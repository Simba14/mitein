import React from 'react';

import Cta from 'components/cta';
import ContactUs from 'components/contactUs';
import ContentSection from 'components/contentSection';
import Hero from 'components/hero';
import Layout from 'components/layout';
import NewsletterBanner from 'components/newsletter';
import { ROUTE_VOLUNTEER } from 'routes';

import styles from './index.module.scss';

const Home = () => {
  return (
    <Layout withContentPadding={false}>
      <div className={`${styles.wrapper}`}>
        <Hero />
        <ContentSection
          anchorId="about"
          className={styles.about}
          translation="home"
          withKey="about"
        >
          <Cta text="Volunteer Now" to={ROUTE_VOLUNTEER} />
        </ContentSection>
        <ContentSection
          anchorId="how"
          className={styles.how}
          translation="home"
          withKey="how"
        >
          <ContactUs translation="home" />
        </ContentSection>
      </div>
    </Layout>
  );
};

// <Newsletter  Banner />

export default Home;
