import server from '@api/server';

export default server.createHandler({
  path: '/api/graphql/',
});

export const config = {
  api: {
    bodyParser: false,
  },
};
