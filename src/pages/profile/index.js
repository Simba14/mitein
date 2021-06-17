import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { withUrqlClient, initUrqlClient } from 'next-urql';
import { ssrExchange, dedupExchange, cacheExchange, fetchExchange } from 'urql';
import Profile from './profile';
import GET_PROFILE from '@graphql/queries/getProfile.graphql';
import GET_SLOTS from '@graphql/queries/getAvailableSlots.graphql';

export const getStaticProps = async ({ locale }) => {
  const ssrCache = ssrExchange({ isClient: false });
  const client = initUrqlClient({
    url: 'http://localhost:9001',
    exchanges: [ssrCache],
  });

  await client.query(GET_PROFILE).toPromise();
  await client.query(GET_SLOTS).toPromise();

  return {
    props: {
      ...(await serverSideTranslations(locale, [
        'profile',
        'calendar',
        'session',
        'header',
        'menu',
      ])),
      urqlState: ssrCache.extractData(),
    },
    revalidate: 600,
  };
};

export default withUrqlClient(
  () => ({
    url: 'http://localhost:9001',
  }),
  { neverSuspend: true, ssr: false },
)(Profile);
