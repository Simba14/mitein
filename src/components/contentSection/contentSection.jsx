import React from 'react';
import { string } from 'prop-types';
import { useTranslation } from 'react-i18next';
import styles from './contentSection.module.scss';

const ContentSection = ({ className, translation, withKey }) => {
  const { t } = useTranslation(translation);
  const translationKey = withKey ? `${withKey}.` : '';
  return (
    <div className={`${styles.container} ${className}`}>
      <h3 className={styles.title}>{t(`${translationKey}title`)}</h3>
      <div
        className={styles.content}
        dangerouslySetInnerHTML={{ __html: t(`${translationKey}content`) }}
      />
    </div>
  );
};

ContentSection.propTypes = {
  className: string,
  translation: string.isRequired,
  withKey: string,
};

ContentSection.defaultProps = {
  className: null,
  withKey: null,
};

export default ContentSection;
