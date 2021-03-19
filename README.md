<h1 align="center">
  Mitein
</h1>

Access the site [here](https://mitein.de/)

This is the frontend repository written in React, which utilises the Gatsby framework.
Gatsby is a static site generator (it creates a single HTML file with the required assets at build time).
This means page loads are very quick. In addition to its performance benefits, it was also chosen for its accessibility, SSR, and
security features. You can learn more about Gatsby through their [documentation](https://www.gatsbyjs.org/docs/).

## 🚀 Quick start

1.  **Start developing.**

    Navigate into your new site’s directory and start it up.

    ```shell
    cd mitein/
    yarn dev
    ```

2.  **Open the source code and start editing!**

    Your site is now running at `http://localhost:8000`!


## 🧐 What's inside?

A quick look at the some of the important Gatsby specific top-level files and directories.

    .
    ├── src
    ├── gatsby-browser.js
    ├── gatsby-config.js
    ├── gatsby-node.js
    ├── gatsby-ssr.js

1.  **`/src`**: This directory will contain all of the code related to what you will see on the front-end of your site (what you see in the browser) such as your site header or a page template. `src` is a convention for “source code”.

2.  **`gatsby-browser.js`**: This file is where Gatsby expects to find any usage of the [Gatsby browser APIs](https://www.gatsbyjs.org/docs/browser-apis/) (if any). These allow customization/extension of default Gatsby settings affecting the browser.

3.  **`gatsby-config.js`**: This is the main configuration file for a Gatsby site. This is where you can specify information about your site (metadata) like the site title and description, which Gatsby plugins you’d like to include, etc. (Check out the [config docs](https://www.gatsbyjs.org/docs/gatsby-config/) for more detail).

4.  **`gatsby-node.js`**: This file is where Gatsby expects to find any usage of the [Gatsby Node APIs](https://www.gatsbyjs.org/docs/node-apis/) (if any). These allow customization/extension of default Gatsby settings affecting pieces of the site build process.

5.  **`gatsby-ssr.js`**: This file is where Gatsby expects to find any usage of the [Gatsby server-side rendering APIs](https://www.gatsbyjs.org/docs/ssr-apis/) (if any). These allow customization of default Gatsby settings affecting server-side rendering.


## Environment variables

Gatsby uses two separate env files. 
- `.env.development` - file used when developing locally i.e. using `yarn dev`
- `.env.production` - files used for production environment i.e using `yarn build`
Please, request the actual values for the environment variables and replace them accordingly.

Note: OS Env Variables that are needed to be accessed in browser Javascript, need to be prefixed with `GATSBY_`. Learn more [here](https://www.gatsbyjs.com/docs/how-to/local-development/environment-variables/#client-side-javascript)

| Variable name                                 | Description                                                     |
| --------------------------------------------- | --------------------------------------------------------------- |
| `GATSBY_COOKIE_USER_ID_IDENTIFIER`            | The name of cookie used to store the user's id.                 |
| `COOKIE_USER_ID_EXPIRE_DAYS`                  | Number of days for the user id cookie to expire.                |
| `GATSBY_API_URL`                              | The Mitein API host.                                            |


## Commands

| Command          | Description                                                                                      |
| ---------------- | ------------------------------------------------------------------------------------------------ |
| `yarn`           | Install the dependencies                                                                         |
| `yarn dev`       | Starts development server                                                                        |
| `yarn build`     | Compiles application                                                                             |
| `yarn serve`     | serve the production build of the site for testing                                               |
| `yarn clean`     | clears the cache (.cache folder) and public directories                                          |
| `yarn test`      | Runs the tests files                                                                             |
| `preload-fonts`  | Generates `font-preload-cache.json`, which contains font asset map in order for pre-loading fonts. Needs to be run after adding routes or new font assets or stylesheets that link to font assets.  |


## 💫 Deploy

[Mitein](https://mitein.de/) is deployed via Netlify. Automatic deployment is set up in relation to this repositories `master` branch.
Therefore, once a PR is merged into master, a deployment will automatically be triggered.

The status of deployments can be monitored [here](https://app.netlify.com/sites/determined-yonath-21e6e6/deploys)


