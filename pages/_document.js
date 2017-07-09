import Document, { Head, Main, NextScript } from 'next/document';
import flush from 'styled-jsx/server'; // eslint-disable-line import/no-extraneous-dependencies

export default class MyDocument extends Document {
  static getInitialProps({ renderPage }) {
    const { html, head, errorHtml, chunks } = renderPage();
    const styles = flush();
    return { html, head, errorHtml, chunks, styles };
  }

  render() {
    return (
      <html lang="en" style={{ overflow: 'hidden' }} >
        <Head>
          <link rel="stylesheet" type="text/css" href="static/css/reset.css" />
          <link rel="stylesheet" type="text/css" href="static/css/kube.min.css" />
          <link rel="stylesheet" type="text/css" href="static/css/default.css" />
        </Head>
        <body className="custom_class">
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}
