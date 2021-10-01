import React from 'react';
import { get } from 'lodash/fp';
import Layout from './layout';

const withLayout = Component => {
  const WithLayout = props => (
    <Layout
      className={get('className', props, null)}
      withContentPadding={get('withContentPadding', props, true)}
    >
      <Component {...props} />
    </Layout>
  );
  WithLayout.displayName = 'withLayout';
  return WithLayout;
};

export default withLayout;
