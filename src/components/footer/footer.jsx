import React from 'react';
import { string } from 'prop-types';
import classnames from 'classnames/bind';

import Anchor from 'components/anchor';
import Svg, { FB, INSTA } from 'components/svg';

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
