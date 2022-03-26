import React from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import classnames from 'classnames/bind';

import Text, { BODY_4, HEADING_1, HEADING_4, HEADING_5 } from 'components/text';
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
      <Text className={cx('heading')} tag="h1" type={HEADING_1}>
        Become a Founder
      </Text>
      <Text className={cx('jobTitle')} tag="h3" type={HEADING_4}>
        Position: Cofounder/*in
      </Text>
      <Text className={cx('paragraph')}>{text.paragraph1}</Text>
      <Text className={cx('paragraph')}>{text.paragraph2}</Text>
      <Text className={cx('subheading')} tag="h4" type={HEADING_5}>
        {text.list1Title}
      </Text>
      <ul className={cx('list')}>
        {text.list1.map((item, index) => (
          <li className={cx('listItem')} key={`list1${index}`}>
            {item}
          </li>
        ))}
      </ul>
      <Text className={cx('subheading')} tag="h4" type={HEADING_5}>
        {text.list2Title}
      </Text>
      <ul className={cx('list')}>
        {text.list2.map((item, index) => (
          <li className={cx('listItem')} key={`list2${index}`}>
            {item}
          </li>
        ))}
      </ul>
      <Text className={cx('apply')} type={BODY_4}>
        If you&apos;re interested please reach out to info@mitein.de!
      </Text>
    </div>
  );
};

export default withLayout(Careers);
