import React from 'react';
import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html>
        <Head>
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/favicons/apple-touch-icon.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/favicons/favicon-32x32.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/favicons/favicon-16x16.png"
          />
          <link rel="manifest" href="/favicons/site.webmanifest" />
          <link
            href="https://fonts.googleapis.com/css2?family=Bowlby+One&family=Cabin+Sketch:wght@400;700&family=Lilita+One&display=swap"
            rel="stylesheet"
          />
          <meta property="og:title" content="Mitein" />
          <meta
            property="og:description"
            content="A non-profit aiming to enrich communities through connection, language and learning."
          />
          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://www.mitein.de/" />
          <meta property="og:image" content="/ogImage.png" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta property="twitter:domain" content="mitein.de" />
          <meta property="twitter:url" content="https://www.mitein.de/" />
          <meta name="twitter:title" content="Mitein" />
          <meta
            name="twitter:description"
            content="A non-profit aiming to enrich communities through connection, language and learning."
          />
          <meta name="twitter:image" content="https://mitein.de/ogImage.png" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
