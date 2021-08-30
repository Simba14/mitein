import React from 'react';
import { get } from 'lodash/fp';
import Layout from './layout';

export default Component => props => (
  <Layout withContentPadding={get('withContentPadding', props, true)}>
    <Component {...props} />
  </Layout>
);
