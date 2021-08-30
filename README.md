<h1 align="center">
  Mitein
</h1>

Access the site [here](https://mitein.de/)

This is the frontend repository written in React, which utilises the Next.js framework.
Next.js allows for static site generation (it creates a single HTML file with the required assets at build time).
This means page loads are very quick. In addition to its performance benefits, it was also chosen for its accessibility, SSR,
security features and ease of production deploys. You can learn more about Next.js through their [documentation](https://nextjs.org/).

## 🚀 Quick start

1.  **Before developing.**
    Firebase CLI is required in order to use features such as the emulator. Install it by doing the following `yarn global firebase-tools`.

    Once installed you will need to authenticate by running `firebase login`

2.  **Start developing.**

    When developing you should utilise the [Firebase emulator suite](https://firebase.google.com/docs/emulator-suite?authuser=2) to test your changes. Before starting the app locally, the emulator needs to be started (see command below).

    The emulator UI is accessible at localhost: `http://localhost:4000`

    The Firestore emulator will be used automatically as long as the env variable `FIRESTORE_EMULATOR_HOST` is set.

    ```shell
    cd mitein/
    yarn firebase emulators:start
    yarn dev
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
    ├── api/
    ├── functions/
    ├── public/
    ├── src/

1.  **`src`**: This directory will contain all of the code related to what you will see on the front-end of your site (what you see in the browser) such as your site header or a page template. `src` is a convention for “source code”.

2.  **`functions`**: This file is where Gatsby expects to find any usage of the [Gatsby browser APIs](https://www.gatsbyjs.org/docs/browser-apis/) (if any). These allow customization/extension of default Gatsby settings affecting the browser.

3.  **`public`**: This is the main configuration file for a Gatsby site. This is where you can specify information about your site (metadata) like the site title and description, which Gatsby plugins you’d like to include, etc. (Check out the [config docs](https://www.gatsbyjs.org/docs/gatsby-config/) for more detail).

4.  **`api`**: This file is where Gatsby expects to find any usage of the [Gatsby Node APIs](https://www.gatsbyjs.org/docs/node-apis/) (if any). These allow customization/extension of default Gatsby settings affecting pieces of the site build process.

## Environment variables

Next.js loads environment variables from `.env.locale`. In order to expose environment variables to the browser, prefix them with `NEXT_PUBLIC_`.

Please, request the actual values for the environment variables and replace them accordingly.

## Commands

| Command               | Description                                                 |
| --------------------- | ----------------------------------------------------------- |
| `yarn`                | Install the dependencies                                    |
| `yarn dev`            | Starts development server                                   |
| `yarn build`          | Compiles application                                        |
| `yarn start-emulator` | Starts the firebase emulator required for local development |
| `yarn clean`          | clears the cache (.cache folder) and public directories     |
| `yarn test`           | Runs the tests files                                        |

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

## 💫 Deploy

[Mitein](https://mitein.de/) is deployed via Netlify. Automatic deployment is set up in relation to this repositories `master` branch.
Therefore, once a PR is merged into master, a deployment will automatically be triggered.

The status of deployments can be monitored [here](https://app.netlify.com/sites/determined-yonath-21e6e6/deploys)
