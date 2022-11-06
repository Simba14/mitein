import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useQuery } from '@apollo/client';
import { compose, get } from 'lodash/fp';

import { LoadingLogo } from 'components/atoms/loading';
import { withLayout } from 'components/blocks/layout';
import IndividualDashboard from 'components/blocks/dashboard/individual';
import RepresentativeDashboard from 'components/blocks/dashboard/representative';

import { sessionProps, withSessionContext } from 'context/session';
import GET_PROFILE from '@graphql/queries/getProfile.graphql';
import { ROUTE_LOGIN } from 'routes';
import { USER_TYPE_REPRESENTATIVE } from '@api/firebase/constants';

const Profile = ({ session }) => {
  const router = useRouter();
  const userId = get('userId', session);
  const { data, loading, error } = useQuery(GET_PROFILE, {
    variables: { id: userId },
    skip: !userId,
  });

  useEffect(() => {
    if (!(userId || data) || error) {
      router.push(ROUTE_LOGIN);
      session.userLoggedOut();
    }
  }, [userId]);

  if (loading) return <LoadingLogo />;
  if (error || !data) return null;

  const { user } = data;

  return user.type === USER_TYPE_REPRESENTATIVE ? (
    <RepresentativeDashboard user={user} />
  ) : (
    <IndividualDashboard user={user} />
  );
};

Profile.propTypes = {
  session: sessionProps,
};

export { Profile };
export default compose(withLayout, withSessionContext)(Profile);
