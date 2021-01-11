const fs = require('fs-extra');
const path = require('path');

require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`,
});

exports.onPostBuild = () => {
  console.log('Copying locales');
  fs.copySync(
    path.join(__dirname, '/src/locales'),
    path.join(__dirname, '/public/locales'),
  );
};

// exports.onCreateBabelConfig = ({ actions }) => {
//   console.log('HERE', process.env.NODE_ENV);
//   if (process.env.NODE_ENV !== 'development') {
//     actions.setBabelPlugin({
//       name: '@babel/plugin-transform-regenerator',
//       options: {},
//     });
//     actions.setBabelPlugin({
//       name: '@babel/plugin-transform-runtime',
//       options: {},
//     });
//   }
// };
