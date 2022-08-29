import React from 'react';
import classnames from 'classnames/bind';
import { useTranslation } from 'next-i18next';

import Anchor from 'components/atoms/anchor';
import Text, { BODY_4, BODY_6 } from 'components/atoms/text';
import { formatChatDate, formatChatTime } from 'helpers/index';
import { USER_TYPE_LEARNER } from '@api/firebase/constants';
import { ChatType, UserType } from '@constants/types';

import styles from './chatRow.module.scss';
import { ROUTE_CHATS_BOOK } from 'routes';

const cx = classnames.bind(styles);

const ChatRow = ({ chat, userType }) => {
  const {
    i18n: { language },
    t,
  } = useTranslation('chat', { keyPrefix: 'pastChats' });
  const isLearner = userType === USER_TYPE_LEARNER;
  const { participant1Name, participant2Name, start, end, type } = chat;
  const otherParticipantName = isLearner ? participant1Name : participant2Name;

  return (
    <li className={cx('chat')}>
      <Text className={cx('title')} type={BODY_4}>
        {t('title', { name: otherParticipantName, type })}
      </Text>
      <Text className={cx('time')} type={BODY_6}>
        {formatChatTime({
          start: start,
          end: end,
          language,
        })}
      </Text>
      <Text className={cx('date')} type={BODY_6}>
        {formatChatDate(start, language, {})}
      </Text>
      <Anchor className={cx('cta')} to={ROUTE_CHATS_BOOK} underlined>
        {t('cta')}
      </Anchor>
    </li>
  );
};

ChatRow.propTypes = {
  chat: ChatType.isRequired,
  userType: UserType.isRequired,
};

export default ChatRow;
