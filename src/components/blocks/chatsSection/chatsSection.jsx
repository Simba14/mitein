import React, { useEffect, useState } from 'react';
import classnames from 'classnames/bind';
import { isEmpty } from 'lodash/fp';
import { useTranslation } from 'next-i18next';
import { string } from 'prop-types';

import Anchor from 'components/atoms/anchor';
import ChatCard from 'components/blocks/chatCard';
import Tabs from 'components/atoms/tabs';
import Text from 'components/atoms/text';
import styles from './chatsSection.module.scss';
import { ChatType, UserType } from '@constants/types';
import { arrayOf } from 'prop-types';

const cx = classnames.bind(styles);

const renderChatCards = ({ chats, userType, userId }) => (
  <div className={cx('chatsContainer')}>
    {chats.map(chat => (
      <ChatCard
        key={chat.id}
        chat={chat}
        status={chat.status}
        userType={userType}
        userId={userId}
      />
    ))}
  </div>
);

const ChatsSection = ({
  requestedChats,
  pastChats,
  upcomingChats,
  userId,
  userType,
}) => {
  const { t } = useTranslation('chat');
  const [tabs, setTabs] = useState([]);

  useEffect(() => {
    setTabs(
      [
        upcomingChats
          ? {
              header: t('upcoming'),
              numberOfItems: upcomingChats.length,
              content: (
                <>
                  <Text className={cx('bookedDescription')}>
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
              header: t('requested'),
              numberOfItems: requestedChats.length,
              content: renderChatCards({
                chats: requestedChats,
                userId,
                userType,
              }),
            }
          : {},
        pastChats
          ? {
              header: t('past'),
              content: renderChatCards({ chats: pastChats, userId, userType }),
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
};

export default ChatsSection;
