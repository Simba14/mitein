import React from 'react';
import { string } from 'prop-types';
import { get } from 'lodash/fp';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { ROUTE_PROFILE } from 'routes';
import BookingPage from '../bookingPage';

export const getServerSideProps = async ({ locale, params }) => {
  const id = get('id', params);
  if (!id) {
    return {
      redirect: {
        destination: ROUTE_PROFILE,
        permanent: false,
      },
    };
  }
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        'chat',
        'common',
        'errors',
        'menu',
      ])),
      id,
    },
  };
};

const RebookChat = ({ id }) => <BookingPage keyPrefix="rebook" id={id} />;

RebookChat.propTypes = {
  id: string,
};

export default RebookChat;
