import React from 'react';
import { useTranslation } from 'next-i18next';

import Anchor from 'components/anchor';
import { withLayout } from 'components/layout';
import styles from './404.module.scss';

const NotFound = () => {
  const { t } = useTranslation('notFound');
  return (
    <div className={styles.notFound}>
      <h1>{t('title')}</h1>
      <div className={styles.returnHome}>
        {t('returnTo')}
        <Anchor to={'/'} className={styles.homeAnchor}>
          {t('link')}
        </Anchor>
      </div>
    </div>
  );
};

export default withLayout(NotFound);
