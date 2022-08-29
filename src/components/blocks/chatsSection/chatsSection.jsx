import React, { useEffect, useState } from 'react';
import classnames from 'classnames/bind';
import { isEmpty } from 'lodash/fp';
import { useTranslation } from 'next-i18next';
import { string } from 'prop-types';

import Anchor from 'components/atoms/anchor';
import ChatCard from 'components/blocks/chatCard';
import ChatRow from 'components/blocks/chatRow';
import Tabs from 'components/atoms/tabs';
import Text from 'components/atoms/text';
import styles from './chatsSection.module.scss';
import { ChatType, UserType } from '@constants/types';
import { arrayOf } from 'prop-types';

const cx = classnames.bind(styles);

const renderChatCards = ({ chats, userType, userId, userDisplayName }) => (
  <div className={cx('chatsContainer')}>
    {chats.map(chat => (
      <ChatCard
        key={chat.id}
        chat={chat}
        status={chat.status}
        userType={userType}
        userId={userId}
        userDisplayName={userDisplayName}
      />
    ))}
  </div>
);

const renderChatRows = ({
  chats,
  description,
  userType,
  userId,
  userDisplayName,
}) => (
  <>
    <Text className={cx('description')}>{description}</Text>
    {chats.map(chat => (
      <ChatRow
        key={chat.id}
        chat={chat}
        userType={userType}
        userId={userId}
        userDisplayName={userDisplayName}
      />
    ))}
  </>
);

const ChatsSection = ({
  requestedChats,
  pastChats,
  upcomingChats,
  userId,
  userType,
  userDisplayName,
}) => {
  const { t } = useTranslation('chat');
  const [tabs, setTabs] = useState([]);

  useEffect(() => {
    setTabs(
      [
        upcomingChats
          ? {
              header: t('upcomingTab'),
              numberOfItems: upcomingChats.length,
              content: (
                <>
                  <Text className={cx('description')}>
                    {t('chatInfo')}
                    <Anchor href={t('zoomHelp')} underlined>
                      {t('chatInfoClick')}
                    </Anchor>
                  </Text>
                  {renderChatCards({
                    chats: upcomingChats,
                    userId,
                    userType,
                  })}
                </>
              ),
            }
          : {},
        requestedChats
          ? {
              header: t('requestedTab'),
              numberOfItems: requestedChats.length,
              content: renderChatCards({
                chats: requestedChats,
                userId,
                userType,
                userDisplayName,
              }),
            }
          : {},
        pastChats
          ? {
              header: t('pastTab'),
              content: renderChatRows({
                chats: pastChats,
                description: t('pastChats.description'),
                userId,
                userType,
                userDisplayName,
              }),
              numberOfItems: pastChats.length,
            }
          : {},
      ].filter(tab => !isEmpty(tab)),
    );
  }, [requestedChats, pastChats, upcomingChats]);

  return <Tabs tabs={tabs} />;
};

ChatsSection.propTypes = {
  requestedChats: arrayOf(ChatType),
  upcomingChats: arrayOf(ChatType),
  pastChats: arrayOf(ChatType),
  userType: UserType.isRequired,
  userId: string.isRequired,
  userDisplayName: string,
};

export default ChatsSection;
