import React, { useState } from 'react';
import { string } from 'prop-types';
import { useMutation, useQuery } from '@apollo/client';

import Cta from 'components/cta';
import BOOK_SESSION from 'graphql/mutations/bookSession.graphql';
import GET_SLOTS from 'graphql/queries/getAvailableSlots.graphql';
import styles from './slots.module.scss';

const Slots = ({ userId }) => {
  const [sessionBooked, setSessionBooked] = useState(false);
  const { data, loading, error } = useQuery(GET_SLOTS);
  const [bookSession] = useMutation(BOOK_SESSION);

  const handleOnClick = () => {
    bookSession({
      variables: { userId, date: Date(), sessionId: '1' },
    }).then(setSessionBooked(true));
  };

  if (loading) return null;

  if (error || !data)
    return (
      <div className={styles.container}>
        No Available Slots. Check back here in the next few days. We are working
        hard to partner with more Retirement homes and native speakers.
      </div>
    );
  console.log({ data });
  if (data)
    return (
      <div className={styles.container}>
        {data.map((session) => (
          <div className={styles.session} key={session.id}>
            <div>Karin A.</div>
            <Cta
              className={styles.bookButton}
              onClick={handleOnClick}
              type="button"
              disabled={sessionBooked}
              text="Book Session"
            />
          </div>
        ))}
      </div>
    );
};

Slots.propTypes = {
  userId: string.isRequired,
};

export default Slots;
