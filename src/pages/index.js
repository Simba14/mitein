import React from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import classnames from 'classnames/bind';

import Cta, { CTA_SIZES } from 'components/atoms/cta';
import ContactUs from 'components/blocks/contactUs';
import ContentSection from 'components/blocks/contentSection';
import Footer from 'components/blocks/footer';
import Hero from 'components/blocks/hero';
import Layout from 'components/blocks/layout';
import { ROUTE_VOLUNTEER } from 'routes';

import styles from './index.module.scss';
const cx = classnames.bind(styles);

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, [
      'common',
      'errors',
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
    <Layout withContentPadding={false} withFooter={false}>
      <div className={cx('wrapper')}>
        <Hero />
        <ContentSection
          anchorId="how"
          className={cx('how')}
          title={t('how.title')}
          content={t('how.content')}
          withWrapper
        />
        <ContentSection
          anchorId="about"
          className={cx('about')}
          title={t('about.title')}
          content={t('about.content')}
          withWrapper
        >
          <Cta
            className={cx('volunteerCta')}
            size={CTA_SIZES.jumbo}
            text={t('volunteerBtn')}
            to={ROUTE_VOLUNTEER}
          />
        </ContentSection>
        <ContactUs className={cx('contact')} translation="home" />
        <Footer className={cx('footer')} />
      </div>
    </Layout>
  );
};

export default Home;
