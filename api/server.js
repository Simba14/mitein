import { ApolloServer } from 'apollo-server-micro';
// import jwt from 'jsonwebtoken';
// import jwksClient from 'jwks-rsa';

// import ErrorFormatter from './error-formatter.js';
// import { Auth } from './auth/index.js';
import resolvers from './resolvers/index.js';
import typeDefs from './schema/typeDefs.js';

// const errorHandler = (err, req, res, next) => {
//   if (res.headersSent) {
//     return next(err);
//   }
//   const { status } = err;
//   res.status(status).json(err);
// };
// app.use(errorHandler);

// const client = jwksClient({
//   jwksUri: ``,
// });
//
// const getKey = (header, cb) => {
//   client.getSigningKey(header.kid, (error, key) => {
//     const signingKey = key.publicKey || key.rsaPublicKey;
//     cb(null, signingKey);
//   });
// };

// const options = {
//   audience: "<YOUR_AUTH0_CLIENT_ID>",
//   issuer: `https://<YOUR_AUTH0_DOMAIN>/`,
//   algorithms: ["RS256"]
// };

// const CLIENT_URL = process.env.CLIENT_URL;

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  playground: true,
  // context: ({ req }) => {
  //   // simple auth check on every request
  //   // const token = req.headers.authorization;
  //   // const user = new Promise((resolve, reject) => {
  //   //   jwt.verify(token, getKey, options, (err, decoded) => {
  //   //     if (err) {
  //   //       return reject(err);
  //   //     }
  //   //     resolve(decoded.email);
  //   //   });
  //   // });
  //
  //   return {
  //     auth: Auth(),
  //   };
  // },
  // extensions: [() => new ErrorFormatter()],
});

// server.applyMiddleware({
//   app,
//   cors: {
//     origin: process.env.CORS_ALLOWED_ORIGINS.split(/,\s*/),
//     credentials: true,
//   },
//   path: '/',
// });

export default server;
