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
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="true"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;700&display=swap"
            rel="stylesheet"
          />
          <link
            rel="preload"
            href="/fonts/LilGrotesk/LilGrotesk-Regular.ttf"
            as="font"
            crossOrigin="true"
          />
          <link
            rel="preload"
            href="/fonts/LilGrotesk/LilGrotesk-Regular.woff"
            as="font"
            crossOrigin="true"
          />
          <link
            rel="preload"
            href="/fonts/LilGrotesk/LilGrotesk-Regular.woff2"
            as="font"
            crossOrigin="true"
          />
          <link
            rel="preload"
            href="/fonts/LilGrotesk/LilGrotesk-Bold.ttf"
            as="font"
            crossOrigin="true"
          />
          <link
            rel="preload"
            href="/fonts/LilGrotesk/LilGrotesk-Bold.woff"
            as="font"
            crossOrigin="true"
          />
          <link
            rel="preload"
            href="/fonts/LilGrotesk/LilGrotesk-Bold.woff2"
            as="font"
            crossOrigin="true"
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
          {/* OneTrust Cookies Consent Notice start for mitein.de --> */}
          <script
            src="https://cdn.cookielaw.org/scripttemplates/otSDKStub.js"
            type="text/javascript"
            charSet="UTF-8"
            data-domain-script="6eea10bb-218f-4159-ba6b-33ff34977e58"
          ></script>
          <script type="text/javascript">{function OptanonWrapper() {}}</script>
          {/* OneTrust Cookies Consent Notice end for mitein.de --> */}
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
