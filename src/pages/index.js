import React from 'react';

import ContentSection from 'components/contentSection';
import Hero from 'components/hero';
import Layout from 'components/layout';

import styles from './index.module.scss';

const Home = () => {
  return (
    <Layout withContentPadding={false}>
      <div className={`${styles.wrapper}`}>
        <Hero />
        <ContentSection
          className={styles.about}
          translation="home"
          withKey="about"
        />
        <ContentSection
          className={styles.how}
          translation="home"
          withKey="how"
        />
      </div>
    </Layout>
  );
};

export default Home;
