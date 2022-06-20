import { func, node } from 'prop-types';
import classnames from 'classnames/bind';
import React from 'react';
import Anchor from 'components/anchor';
import { withTranslation } from 'next-i18next';
import Cta from 'components/cta';
import Layout from 'components/layout';
import { ROUTE_BASE } from 'routes';

import styles from './errorBoundary.module.scss';
import Text, { HEADING_2 } from 'components/text';
const cx = classnames.bind(styles);

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);

    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch() {
    // TODO: add Sentry logging
    // console.log({ error, errorInfo });
  }

  render() {
    const { children, t } = this.props;
    if (this.state.hasError) {
      return (
        <Layout>
          <div className={cx('container')}>
            <Text className={cx('title')} type={HEADING_2}>
              {t('error.title')}
            </Text>
            <Cta
              className={cx('cta')}
              onClick={() => this.setState({ hasError: false })}
              text={t('error.cta')}
            />
            <span>
              {t('error.returnTo')}
              <Anchor className={cx('link')} to={ROUTE_BASE} underlined>
                {t('error.link')}
              </Anchor>
            </span>
          </div>
        </Layout>
      );
    }

    return children;
  }
}

ErrorBoundary.propTypes = {
  children: node.isRequired,
  t: func.isRequired,
};

export default withTranslation('common', { keyPrefix: 'error' })(ErrorBoundary);
