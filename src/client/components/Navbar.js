import Link from 'next/link';
import {
  NAVBAR_HEIGHT,
} from 'constants';

const Navbar = () => {
  return (
    <div className="navbar" >

      <div className="section section-1">
        <Link href="/">
          <a className="logoLink" >
            <div className="logoName" >{'Map Places'}</div>
          </a>
        </Link>
        <div style={{ marginRight: '10px' }} />
        <div className="item">Maps</div>
        <div style={{ marginRight: '10px' }} />
        <div className="item">Other</div>
      </div>
      <div className="section section-2">
        <div className="searchWrap">
          <input className="search" type="text" placeholder="Search" />
        </div>
      </div>
      <div className="section section-3">
        <Link href="/login">
          <a>
            <button className="button outline">Login</button>
          </a>
        </Link>
        <div style={{ marginRight: '10px' }} />
        <Link href="/signup">
          <a>
            <button className="button outline secondary">Signup</button>
          </a>
        </Link>
      </div>

      <style jsx>{`
        .navbar {
          height: ${NAVBAR_HEIGHT}px;
          display: flex;
          align-items: center;

          padding: 0 20px;

          background: #eee;
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          border-bottom: solid black 2px;

        }
        .logoName {
          font-size: 20px;
          color: rgb(49, 52, 57);
          cursor: pointer;
          text-decoration: none;
        }
        .logoLink {
          text-decoration: none;
        }
        .box {
          // border: solid black 1px;
        }
        .section {
          // border: solid black 1px;
        }
        .section-1 {
          display: flex;
          margin-right: 20px;
          white-space: nowrap;
        }
        .section-2 {
           flex: 1;
        }
        .section-3 {
          display: flex;
          justify-content: flex-end;
          margin-left: 20px;
        }
        .searchWrap {
          margin: 0 20px;
        }
        .search {

        }
      `}</style>
    </div>

  );
};

export default Navbar;
