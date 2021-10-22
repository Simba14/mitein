import React from 'react';
import { string } from 'prop-types';
import classnames from 'classnames/bind';

import Anchor from 'components/anchor';
import FacebookIcon from 'assets/facebook.svg';
import InstagramIcon from 'assets/instagram.svg';

import styles from './footer.module.scss';
const cx = classnames.bind(styles);

const SOCIALS = [
  { key: 'fb', Icon: FacebookIcon, url: 'https://facebook.com/mitein.berlin' },
  {
    key: 'insta',
    Icon: InstagramIcon,
    url: 'https://instagram.com/mitein.berlin',
  },
];

const Footer = ({ className }) => {
  return (
    <footer className={cx('footer', className)}>
      <div className={cx('content')}>
        <div>
          <div>Mitein 2021</div>
          <Anchor href="info@mitein.de">info@mitein.de</Anchor>
        </div>
        <div></div>
        <div className={cx('socials')}>
          {SOCIALS.map(({ Icon, url, key }) => (
            <a className={cx('socialLink')} href={url} key={key}>
              <Icon className={cx('socialLink')} />
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
