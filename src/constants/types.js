import { shape, string, oneOf } from 'prop-types';
import {
  USER_TYPE_LEARNER,
  USER_TYPE_NATIVE,
  CHAT_STATUS_BOOKED,
  CHAT_STATUS_CANCELLED,
  CHAT_STATUS_REJECTED,
  CHAT_STATUS_REQUESTED,
} from '@api/firebase/constants';

export const ChatType = shape({
  id: string.isRequired,
  link: string,
  start: string,
  end: string,
});

export const StatusType = oneOf([
  CHAT_STATUS_BOOKED,
  CHAT_STATUS_CANCELLED,
  CHAT_STATUS_REJECTED,
  CHAT_STATUS_REQUESTED,
]);

export const UserType = oneOf([USER_TYPE_LEARNER, USER_TYPE_NATIVE]);
