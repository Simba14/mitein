import { get } from 'lodash/fp.js';

export default {
  Organization: {
    description: (organization, { locale }) =>
      get(['description', locale], organization),
  },
};
