import React from 'react';
import { string } from 'prop-types';
import classnames from 'classnames/bind';

import Anchor from 'components/anchor';
import FacebookIcon from 'assets/facebook.svg';
import InstagramIcon from 'assets/instagram.svg';

import styles from './footer.module.scss';
const cx = classnames.bind(styles);

export const INFO_EMAIL = 'info@mitein.de';
export const FB_URL = 'https://facebook.com/mitein.berlin';
export const IG_URL = 'https://instagram.com/mitein.berlin';
const SOCIALS = [
  {
    key: 'facebook',
    Icon: FacebookIcon,
    url: FB_URL,
  },
  {
    key: 'instagram',
    Icon: InstagramIcon,
    url: IG_URL,
  },
];

const Footer = ({ className }) => {
  return (
    <footer className={cx('footer', className)}>
      <div className={cx('content')}>
        <div>
          <div>Mitein 2021</div>
          <Anchor href={`mailto: ${INFO_EMAIL}`}>{INFO_EMAIL}</Anchor>
        </div>
        <div className={cx('legal')}>
          <button
            id="ot-sdk-btn"
            className={`ot-sdk-show-settings ${cx('cookies')}`}
          >
            Cookie Settings
          </button>
        </div>
        <div className={cx('socials')}>
          {SOCIALS.map(({ Icon, url, key }) => (
            <a className={cx('socialLink')} href={url} key={key}>
              <Icon className={cx('socialLink')} aria-hidden="true" />
              <span className={cx('socialLabel')}>{key}</span>
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
