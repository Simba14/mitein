import React from 'react';
import { useQuery } from '@apollo/client';

import GET_SLOTS from 'graphql/queries/getAvailableSlots.graphql';
// import styles from './slots.module.scss';

const Slots = () => {
  const { data, loading, error } = useQuery(GET_SLOTS);

  if (loading || error) return null;
  console.log({ data });
  if (data) return <div className={styles.container}>Slot</div>;
  else
    return (
      <div className={styles.container}>
        No Available Slots. Check back here in the next few days. We are working
        hard to partner with more Retirement homes and native speakers.
      </div>
    );
};

export default Slots;
