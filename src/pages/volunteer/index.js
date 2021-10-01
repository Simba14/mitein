import { get } from 'lodash/fp';
import { client } from 'apollo/client';
import GET_VOLUNTEERING_OPPS from '@graphql/queries/getVolunteeringOpps.graphql';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import classnames from 'classnames/bind';

import styles from './volunteer.module.scss';
const cx = classnames.bind(styles);

// export const getStaticProps = async ({ locale }) => {
//   const organizationsQuery = await client.query({
//     query: GET_VOLUNTEERING_OPPS,
//     variables: { city: 'Berlin', locale },
//   });
//
//   const organizations = get('data.volunteerWith', organizationsQuery);
//
//   return {
//     props: {
//       withContentPadding: false,
//       organizations,
//       ...(await serverSideTranslations(locale, [
//         'common',
//         'form',
//         'menu',
//         'newsletter',
//         'volunteer',
//       ])),
//     },
//   };
// };

export const getServerSideProps = async ({ locale }) => {
  const organizationsQuery = await client.query({
    query: GET_VOLUNTEERING_OPPS,
    variables: { city: 'Berlin', locale },
  });

  const organizations = get('data.volunteerWith', organizationsQuery);

  return {
    props: {
      className: cx('volunteerLayout'),
      organizations,
      ...(await serverSideTranslations(locale, [
        'common',
        'form',
        'menu',
        'newsletter',
        'volunteer',
      ])),
    },
  };
};

export { default } from './volunteer.jsx';
