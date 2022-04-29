import React from 'react';
import classnames from 'classnames/bind';
import { useTranslation } from 'next-i18next';

import Anchor from 'components/anchor';
import Text, { HEADING_1 } from 'components/text';
import { withLayout } from 'components/layout';
import styles from './404.module.scss';

const cx = classnames.bind(styles);

const NotFound = () => {
  const { t } = useTranslation('notFound');
  return (
    <div className={cx('notFound')}>
      <Text className={cx('title')} tag="h1" type={HEADING_1}>
        {t('title')}
      </Text>
      <Text className={cx('returnHome')}>
        {t('returnTo')}
        <Anchor to={'/'} className={cx('homeAnchor')}>
          {t('link')}
        </Anchor>
      </Text>
    </div>
  );
};

export default withLayout(NotFound);
