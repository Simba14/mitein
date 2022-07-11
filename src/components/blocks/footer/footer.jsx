import React from 'react';
import { string } from 'prop-types';
import classnames from 'classnames/bind';
import { useTranslation } from 'next-i18next';

import Anchor from 'components/atoms/anchor';
import Svg, { FB, INSTA } from 'components/atoms/svg';
import Text from 'components/atoms/text';
import { ROUTE_PRIVACY, ROUTE_TERMS } from 'routes';

import styles from './footer.module.scss';
const cx = classnames.bind(styles);

export const INFO_EMAIL = 'info@mitein.de';
export const FB_URL = 'https://facebook.com/mitein.berlin';
export const IG_URL = 'https://instagram.com/mitein.berlin';
const SOCIALS = [
  {
    key: FB,
    url: FB_URL,
  },
  {
    key: INSTA,
    url: IG_URL,
  },
];

const Footer = ({ className }) => {
  const { t } = useTranslation('common');
  return (
    <footer className={cx('footer', className)}>
      <div className={cx('content')}>
        <div className={cx('companyInfo')}>
          <Text>{t('miteinWithYear')}</Text>
          <Anchor href={`mailto: ${INFO_EMAIL}`}>{INFO_EMAIL}</Anchor>
        </div>
        <div className={cx('legal')}>
          <button
            id="ot-sdk-btn"
            className={`ot-sdk-show-settings ${cx('cookies')}`}
          >
            {t('cookies')}
          </button>
          <Anchor to={ROUTE_PRIVACY}>{t('privacy')}</Anchor>
          <Anchor to={ROUTE_TERMS}>{t('terms')}</Anchor>
        </div>
        <div className={cx('socials')}>
          {SOCIALS.map(({ url, key }) => (
            <a className={cx('socialLink')} href={url} key={key}>
              <Svg className={cx('socialLink')} aria-hidden="true" name={key} />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};

Footer.propTypes = {
  className: string,
};

Footer.defaultProps = {
  className: '',
};

export default Footer;
