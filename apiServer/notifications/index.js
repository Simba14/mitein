import axios from 'axios';
import { get } from 'lodash/fp';
import config from '@api/config';

import { NewsletterEmailAlreadySubscribedError } from '@api/notifications/errors';

const DUPLICATE_CODE = 'duplicate_parameter';

export const subscribeContactToNewsletter = async email => {
  const {
    sendinblue: { apiKey, baseUrl, listId },
  } = config;

  const options = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'api-key': apiKey,
    },
  };

  return axios
    .post(
      `${baseUrl}/contacts`,
      {
        api_key: apiKey,
        email: email,
        listIds: [listId],
      },
      options,
    )
    .catch(error => {
      const errorCode = get('response.data.code', error);
      console.log({
        errorCode,
      });
      if (errorCode === DUPLICATE_CODE)
        throw new NewsletterEmailAlreadySubscribedError();

      throw error;
    });
};
