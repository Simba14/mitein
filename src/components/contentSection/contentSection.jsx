import React from 'react';
import { string } from 'prop-types';
import { useTranslation } from 'react-i18next';
import styles from './contentSection.module.scss';

const ContentSection = ({ title }) => {
  const { t } = useTranslation(title);
  return (
    <div className={styles.container}>
      <h3 className={styles.title}>{t('title')}</h3>
      <div
        className={styles.content}
        dangerouslySetInnerHTML={{ __html: t('content') }}
      />
    </div>
  );
};

ContentSection.propTypes = {
  title: string.isRequired,
};

export default ContentSection;
