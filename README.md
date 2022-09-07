<center><img alt='Mitein' src='./src/assets/wordmark.svg' width=400 /></center>

Access the site [here](https://mitein.de/)

Mitein is a non-profit aimed at strengthening local communinities through learning and connection. You can read more about our mission [here](https://www.mitein.de/#about)

This is the frontend repository written in React, which utilises the Next.js framework.
Next.js allows for static site generation (it creates a single HTML file with the required assets at build time).
This means page loads are very quick. In addition to its performance benefits, it was also chosen for its accessibility, SSR, security features and ease of production deploys. You can learn more about Next.js through their [documentation](https://nextjs.org/).

Mitein is a serverless application. It leverages a [Cloud Firestore](https://firebase.google.com/docs/firestore) database, and which is connected to the frontend via an Apollo GraphQL api.

## 🚀 Quick start

1.  **Before developing.**
    Firebase CLI is required in order to use features such as the emulator. Install it by doing the following `npm install -g firebase-tools`.

    Once installed you will need to authenticate by running `firebase login`

2.  **Start developing.**

    When developing you should utilise the [Firebase emulator suite](https://firebase.google.com/docs/emulator-suite?authuser=2) to test your changes. Before starting the app locally, the emulator needs to be started (see command below).

    The emulator UI is accessible at localhost: `http://localhost:4000`

    The Firestore emulator will be used automatically as long as the env variable `FIRESTORE_EMULATOR_HOST` is set.

    ```shell
    cd mitein/
    npm run firebase emulators:start
    npm run dev // in a separate terminal tab
    ```

3.  **Open the source code and start editing!**

    Your site is now running at `http://localhost:8000`!

## 🧐 What's inside?

With Next.js, pages are automatically created when a component is added to `src/pages/` folder.
For example, the component `src/pages/about.jsx` will add the route `mitein.de/about` where the component will be served.

Currently, the app is available in two languages, English and German, and utilises i18next to do so. For each page, a localised route is automatically created.

English is the default locale, and its routes are delivered at the base path automatically. German localised routes have the following form e.g. `/de/about`.

Any file inside the folder pages/api is mapped to /api/\* and will be treated as an API endpoint instead of a page. They are server-side only bundles and won't increase your client-side bundle size.

A quick look at the some of the important specific top-level files and directories.

    .
    ├── apiServer/
    ├── functions/
    ├── public/
    ├── src/

1.  **`src`**: This directory will contain all of the code related to what you will see on the front-end of the site (what you see in the browser).

2.  **`functions`**: This contains all the responsible for creating and deploying Google Cloud functions. Currently, there is one function, responsible for sending emails on a scheduled basis to notify users about chats available at their designated times.

3.  **`public`**: Stores static assets such as images, fonts, etc. Files inside public directory can then be referenced by your code starting from the base URL (/).

4.  **`apiServer`**: This directory contains all the relating the "back-end" functionality of the application. This includes the initialisation of the Apollo GraphQL server and it's related schema and resolvers. It also includes the functions and logic responsible for managing and updating the firebase database.

## Environment variables

Next.js loads environment variables from `.env.locale`. In order to expose environment variables to the browser, prefix them with `NEXT_PUBLIC_`.

The required env variables can be viewed in `.env.local.example`.
Please, request the actual values for the environment variables and replace them accordingly.

Unfortunately, Vercel has a 4kb limit on env variable storage.
Therefore, most env variables have been encrypted to a single value, which is then decrypted using the appropriate keys.

More information on this can be found [here](https://vercel.com/support/articles/how-do-i-workaround-vercel-s-4-kb-environment-variables-limit)

## Commands

| Command                  | Description                                                 |
| ------------------------ | ----------------------------------------------------------- | --- |
| `npm run`                | Install the dependencies                                    |
| `npm run dev`            | Starts development server                                   |
| `npm run build`          | Compiles application                                        |
| `npm run start-emulator` | Starts the firebase emulator required for local development | \   |
| `npm run stop-emulator`  | Stops the firebase emulator safely                          |
| `npm run clean`          | clears the cache (.cache folder) and public directories     |
| `npm run test`           | Runs the tests files                                        |
| `npm run test-watch`     | Runs the tests under watch mode                             |

## Data Fetching

Next.js has two forms of pre-rendering, server side and static generation. Both are used based on the specific page requirements.

1. Static Generation
   If you export an async function called getStaticProps from a page, Next.js will pre-render this page at build time.

You should use getStaticProps if:

- The data required to render the page is available at build time ahead of a user’s request.
- The data comes from a headless CMS.
  The data can be publicly cached (not user-specific).
- The page must be pre-rendered (for SEO) and be very fast — getStaticProps generates HTML and JSON files, both of which can be cached by a CDN for performance.

More info on getStatic props [here](https://nextjs.org/docs/basic-features/data-fetching#getstaticprops-static-generation)

If a page has dynamic routes and uses getStaticProps it needs to define a list of paths that have to be rendered to HTML at build time. This can be achieved by using the `getStaticPaths` function. More [here](https://nextjs.org/docs/basic-features/data-fetching#getstaticpaths-static-generation).

2. Server Side Rendering (SSR)
   Enabled by exporting the async function `getServerSideProps` from the pages main file.
   It will fetch data on each request.

**When to use:** only if you need to pre-render a page whose data must be fetched at request time. Time to first byte (TTFB) will be slower than getStaticProps because the server must compute the result on every request, and the result cannot be cached by a CDN without extra configuration

More info [here](https://nextjs.org/docs/basic-features/data-fetching#getserversideprops-server-side-rendering)

## 🤝 Contributing

Mitein's goal is to help strengthen connections and communities. Therefore, it makes perfect sense for Mitein to be open-source and invite the power of community to its code! Any contribution is greatly appreciated and needed. Mitein is volunteer led and will never be a for-profit platform.

You can find out [here](https://github.com/Simba14/mitein/blob/main/CONTRIBUTING.md) how you can start contributing to our codebase right away.

## 💫 Deploy

[Mitein](https://mitein.de/) is deployed via Vercel. Automatic deployment is set up in relation to this repositories `main` branch.
Therefore, once a PR is merged, a deployment will automatically be triggered.

The status of deployments can be monitored [here](https://vercel.com/simba14/mitein/deployments)

## 📖 License

Copyright (c), Sean Blundell. All rights reserved.
Licensed under the [GNU Affero General Public License v3.0](https://github.com/Simba14/mitein/blob/main/LICENSE.txt).
