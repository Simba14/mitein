import React from 'react';
import classnames from 'classnames/bind';
import { string } from 'prop-types';
import { useTranslation } from 'next-i18next';

import Text from 'components/text';
import { formatSessionDate } from 'helpers/index';
import styles from './suspended.module.scss';

const cx = classnames.bind(styles);

const Suspended = ({ suspendedUntil }) => {
  const {
    i18n: { language: locale },
    t,
  } = useTranslation('common', { keyPrefix: 'suspended' });

  return (
    <div className={cx('suspended')}>
      <Text>
        {t('until', {
          date: formatSessionDate(suspendedUntil, locale),
        })}
      </Text>
      <Text className={cx('suspendedNote')}>{t('note')}</Text>
    </div>
  );
};

Suspended.propTypes = {
  suspendedUntil: string.isRequired,
};

export default Suspended;
