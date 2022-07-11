import React from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import TextPage, {
  HEADING,
  TITLE,
  SUBTITLE,
  PARAGRAPH,
  LIST,
  EMPHASIZE,
} from 'components/blocks/textPage';
import { withLayout } from 'components/blocks/layout';

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common', 'careers', 'menu'])),
  },
});

const content = [
  { text: 'Become a Founder', type: HEADING },
  { text: 'Position: Cofounder/*in', type: TITLE },
  {
    text: 'Mitein is a non-profit aiming to improve people’s German whilst providing human connection to those who currently find themselves socially isolated.A soon to launch platform that will match those looking to sharpen their German skills with native speakers looking for someone to talk with. We want to help bridge the intergenerational gap, and create conversations that otherwise wouldn’t take place. Conversations that are purposeful, enjoyable and build confidence.',
    type: PARAGRAPH,
  },

  {
    text: 'As the platform is yet to launch, has no income or funding, the position, unfortunately, will be unpaid but hopefully that will change as Mitein grows! Therefore, I am looking for someone who already has a source of income that wants to help build a meaningful project in their spare time.',
    type: PARAGRAPH,
  },
  { text: 'You...', type: SUBTITLE },
  {
    text: [
      'Are passionate about social causes and want to help others feel more connected to their communities and others',
      'Want to help launch a non-profit and shape its strategy',
      'Native German Speaker & Conversational in English',
      'Strong writing skills (Deutsch)',
      'Social Media savvy',
      'Can spare 10 hours a week',
    ],
    type: LIST,
  },
  { text: 'As a Mitein Co-founder…', type: SUBTITLE },
  {
    text: [
      'You will help create the company strategy and direction',
      'Come up with new features for the platform',
      'Reach out and develop relationships with institutions and companies that are potential users off the Mitein platform (e.g. Retirement homes)',
      'Research and prepare funding applications',
      'Manage the communications plan (social media, email etc.)',
      'Anything else that you’d like to try, the role will be your own!',
    ],
    type: LIST,
  },
  {
    text: "If you're interested please reach out to info@mitein.de!", // eslint-disable-line quotes
    type: EMPHASIZE,
  },
];

const Careers = () => {
  return <TextPage content={content} />;
};

export default withLayout(Careers);
