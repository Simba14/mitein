import React from 'react';
import { node, string } from 'prop-types';
import { useTranslation } from 'next-i18next';
import styles from './contentSection.module.scss';

const ContentSection = ({
  anchorId,
  children,
  className,
  translation,
  withKey,
}) => {
  const { t } = useTranslation(translation);
  const translationKey = withKey ? `${withKey}.` : '';
  return (
    <div id={anchorId} className={`${styles.wrapper} ${className}`}>
      <div className={styles.container}>
        <h3 className={styles.title}>{t(`${translationKey}title`)}</h3>
        <div className={styles.content}>{t(`${translationKey}content`)}</div>
        {children}
      </div>
    </div>
  );
};

ContentSection.propTypes = {
  anchorId: string,
  children: node,
  className: string,
  translation: string.isRequired,
  withKey: string,
};

ContentSection.defaultProps = {
  anchorId: null,
  className: null,
  withKey: null,
};

export default ContentSection;
