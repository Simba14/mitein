import React from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import classnames from 'classnames/bind';

import Text, { HEADING_1, HEADING_6 } from 'components/atoms/text';

import styles from './resources.module.scss';
const cx = classnames.bind(styles);

import { withLayout } from 'components/blocks/layout';
import Accordion from 'components/atoms/accordion';
import TextBanner from 'components/atoms/textBanner';
import content from 'content/conversationHelpers';

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common', 'menu', 'resources'])),
  },
});

const Resources = () => {
  const { t } = useTranslation('resources');
  return (
    <div className={cx('wrapper')}>
      <TextBanner textType={HEADING_1} tag="h1">
        {t('title')}
      </TextBanner>
      <Text className={cx('description')}>{t('description')}</Text>
      {content.map(prompt => (
        <Accordion
          key={prompt.title}
          ariaId={`${prompt.title} accordion`}
          className={cx('section')}
          headerText={prompt.title}
          headerClassName={cx('sectionHeader')}
          contentClassName={cx('itemsContainer')}
          content={prompt.items.map(item => (
            <div className={cx('item')} key={item.question}>
              <Text className={cx('itemHeading')} type={HEADING_6} tag="h4">
                {item.question}
              </Text>
              {item.options && (
                <ul className={cx('options')}>
                  {item.options?.map(option => (
                    <li key={option}>{option}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        />
      ))}
    </div>
  );
};

export default withLayout(Resources);
