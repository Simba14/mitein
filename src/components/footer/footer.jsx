import React from 'react';
import { string } from 'prop-types';
import classnames from 'classnames/bind';

import Anchor from 'components/anchor';
import styles from './footer.module.scss';
const cx = classnames.bind(styles);

const Footer = ({ className }) => {
  return (
    <div className={cx('footer', className)}>
      <div>
        <div>Mitein 2021</div>
        <Anchor href="info@mitein.de">info@mitein.de</Anchor>
      </div>
      <div>
        Icons made by{' '}
        <a href="https://www.flaticon.com/authors/freepik" title="Freepik">
          Freepik
        </a>{' '}
        from{' '}
        <a href="https://www.flaticon.com/" title="Flaticon">
          www.flaticon.com
        </a>
      </div>
      <div className={cx('socials')}>Social Icons</div>
    </div>
  );
};

Footer.propTypes = {
  className: string,
};

Footer.defaultProps = {
  className: '',
};

export default Footer;
