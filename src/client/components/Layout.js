import PropTypes from 'prop-types';
import Head from 'next/head';

import Navbar from 'components/Navbar';

import {
  NAVBAR_HEIGHT,
  DEFAULT_TITLE,
} from 'constants';

const Layout = ({
  htmlTitle,
  children,
}) => (
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
        height: 100%;
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
Layout.propTypes = {
  htmlTitle: PropTypes.string,
  children: PropTypes.node.isRequired,
};

export default Layout;
