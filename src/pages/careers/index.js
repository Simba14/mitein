import React, { useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import classnames from 'classnames/bind';
import { useRouter } from 'next/router';

import { withLayout } from 'components/layout';

import styles from './careers.module.scss';
const cx = classnames.bind(styles);

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common', 'careers', 'menu'])),
  },
});

const text = {
  paragraph1:
    'Mitein is a non-profit aiming to improve people’s German whilst providing human connection to those who currently find themselves socially isolated.A soon to launch platform that will match those looking to sharpen their German skills with native speakers looking for someone to talk with. We want to help bridge the intergenerational gap, and create conversations that otherwise wouldn’t take place. Conversations that are purposeful, enjoyable and build confidence.',
  paragraph2:
    'As the platform is yet to launch, has no income or funding, the position, unfortunately, will be unpaid but hopefully that will change as Mitein grows! Therefore, I am looking for someone who already has a source of income that wants to help build a meaningful project in their spare time.',
  list1Title: 'You...',
  list2Title: 'As a Mitein Co-founder…',
  list1: [
    'Are passionate about social causes and want to help others feel more connected to their communities and others',
    'Want to help launch a non-profit and shape its strategy',
    'Native German Speaker & Conversational in English',
    'Strong writing skills (Deutsch)',
    'Social Media savvy',
    'Can spare 10 hours a week',
  ],
  list2: [
    'You will help create the company strategy and direction',
    'Come up with new features for the platform',
    'Reach out and develop relationships with institutions and companies that are potential users off the Mitein platform (e.g. Retirement homes)',
    'Research and prepare funding applications',
    'Manage the communications plan (social media, email etc.)',
    'Anything else that you’d like to try, the role will be your own!',
  ],
};

const Careers = () => {
  return (
    <div className={cx('careers')}>
      <h1 className={cx('heading')}>Become a Founder</h1>
      <h3 className={cx('jobTitle')}>Position: Cofounder/*in</h3>
      <div className={cx('paragraph')}>{text.paragraph1}</div>
      <div className={cx('paragraph')}>{text.paragraph2}</div>
      <h4 className={cx('subheading')}>{text.list1Title}</h4>
      <ul className={cx('list')}>
        {text.list1.map((item, index) => (
          <li className={cx('listItem')} key={`list1${index}`}>
            {item}
          </li>
        ))}
      </ul>
      <h4 className={cx('subheading')}>{text.list2Title}</h4>
      <ul className={cx('list')}>
        {text.list2.map((item, index) => (
          <li className={cx('listItem')} key={`list2${index}`}>
            {item}
          </li>
        ))}
      </ul>
      <div className={cx('apply')}>
        If you're interested please reach out to info@mitein.de!
      </div>
    </div>
  );
};

export default withLayout(Careers);
