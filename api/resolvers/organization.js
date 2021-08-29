import { get } from 'lodash/fp';

export default {
  Organization: {
    description: (organization, { locale }) =>
      get(['description', locale], organization),
  },
};
