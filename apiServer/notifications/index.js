import axios from 'axios';
import { get } from 'lodash/fp';
import config from '@api/config';

import {
  MEMBER_EXISTS_CODE,
  NewsletterEmailAlreadySubscribedError,
} from '@api/notifications/errors';

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
      const errorCode = get('code', error);

      if (errorCode === MEMBER_EXISTS_CODE)
        throw new NewsletterEmailAlreadySubscribedError();

      throw error;
    });
};
