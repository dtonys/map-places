import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';

import Navbar from 'components/Navbar';

import {
  NAVBAR_HEIGHT,
  DEFAULT_TITLE,
} from 'constants';

class Layout extends React.Component {  // eslint-disable-line
  static propTypes = {
    htmlTitle: PropTypes.string,
    children: PropTypes.node.isRequired,
  }

  render() {
    const {
      htmlTitle,
      children,
    } = this.props;

    return (
      <div>
        <Head>
          <title>{ htmlTitle || DEFAULT_TITLE }</title>
        </Head>
        <Navbar />
        <div className="scrollWrap">
          <div className="content">
            { children }
          </div>
        </div>
        <style jsx>{`
          .content {
            max-width: 840px;
            margin: auto;
          }
          .scrollWrap {
            position: absolute;
            top: ${NAVBAR_HEIGHT}px;
            left: 0;
            right: 0;
            bottom: 0;
            // border: solid red 1px;
            overflow: auto;
          }
          h1 {
            text-align: center;
          }
        `}</style>
      </div>
    );
  }
}

export default Layout;
