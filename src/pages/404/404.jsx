import React from 'react';

import Anchor from 'components/anchor';
import { withLayout } from 'components/layout';
import styles from './404.module.scss';

const NotFound = () => {
  return (
    <div className={styles.notFound}>
      <h1>Page not found</h1>
      <div className={styles.returnHome}>
        Return back to the{' '}
        <Anchor to={'/'} className={styles.homeAnchor}>
          home page
        </Anchor>
      </div>
    </div>
  );
};

export default withLayout(NotFound);
