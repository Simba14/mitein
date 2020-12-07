import React from 'react';
import Layout from './layout';

export default Component => props => (
  <Layout>
    <Component {...props} />
  </Layout>
);
