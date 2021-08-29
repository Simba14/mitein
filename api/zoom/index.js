import jwt from 'jsonwebtoken';
import { get } from 'lodash/fp';
import axios from 'axios';
import config from '@api/config';

const payload = {
  iss: config.zoom.apiKey,
  exp: new Date().getTime() + 5000,
};
const token = jwt.sign(payload, config.zoom.apiSecret);

export const generateZoomLink = (start) =>
  axios({
    method: 'post',
    url: `${config.zoom.baseUrl}/users/${config.zoom.hostEmail}/meetings`,
    headers: {
      Authorization: `Bearer ${token}`,
      'User-Agent': 'Zoom-api-Jwt-Request',
      'content-type': 'application/json',
    },
    data: {
      topic: 'Mitein: Chat',
      type: 2,
      start_time: start,
      duration: 30,
      join_before_host: true,
    },
  })
    .then((res) => {
      console.log({ join: get('data.join_url', res), start });
      return get('data.join_url', res);
    })
    .catch((error) => {
      console.log({ error });
    });
