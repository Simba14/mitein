import { get } from 'lodash/fp';
import { client } from 'apollo/client';
import GET_VOLUNTEERING_OPPS from '@graphql/queries/getVolunteeringOpps.graphql';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export const getStaticProps = async ({ locale }) => {
  const organizationsQuery = await client.query({
    query: GET_VOLUNTEERING_OPPS,
    variables: { city: 'Berlin', locale },
  });

  const organizations = get('data.volunteerWith', organizationsQuery);

  return {
    props: {
      withContentPadding: false,
      organizations,
      ...(await serverSideTranslations(locale, [
        'volunteer',
        'header',
        'menu',
        'newsletter',
        'form',
      ])),
    },
  };
};

export { default } from './volunteer.jsx';
