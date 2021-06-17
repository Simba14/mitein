import config from '../config.js';
import { get } from 'lodash/fp';
import axios from 'axios';

import {
  MEMBER_EXISTS_CODE,
  NewsletterEmailAlreadySubscribedError,
} from './errors';

const ADD_CONTACT_URL = 'https://emailoctopus.com/api/1.5/lists/';

export const subscribeContactToNewsletter = async email => {
  const {
    octopus: { apiKey, listId },
  } = config;

  return axios
    .post(`${ADD_CONTACT_URL}${listId}/contacts`, {
      api_key: apiKey,
      email_address: email,
      status: 'SUBSCRIBED',
    })
    .catch(error => {
      const errorCode = get('response.data.error.code', error);
      console.error(errorCode);
      if (errorCode === MEMBER_EXISTS_CODE)
        throw new NewsletterEmailAlreadySubscribedError();

      throw error;
    });
};
