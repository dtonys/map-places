import { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'routes/pageRoutes';
import { connect } from 'react-redux';

import {
  NAVBAR_HEIGHT,
} from 'constants';
import {
  extractAuthenticated,
  extractCurrentUser,
} from 'redux-modules/reducers/user';
import makeAction, {
  request,
} from 'helpers/reduxAction';
import {
  ACTION_LOGOUT,
} from 'redux-modules/actions/user';


@connect(
  (globalState) => ({
    userAuthenticated: extractAuthenticated(globalState),
    currentUser: extractCurrentUser(globalState),
  })
)
class Navbar extends Component {
  static propTypes = {
    userAuthenticated: PropTypes.bool.isRequired,
    currentUser: PropTypes.object,
    dispatch: PropTypes.func,
  }

  onLogoutClick = () => {
    const { dispatch } = this.props;
    dispatch(
      makeAction( request(ACTION_LOGOUT) )
    );
  }

  render() {
    const {
      userAuthenticated,
      currentUser,
    } = this.props;

    return (
      <div className="navbar" >
        <div className="section section-1">
          <Link route="/">
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
          {/*
            <div className="searchWrap">
              <input className="search" type="text" placeholder="Search" />
            </div>
          */}
        </div>
        { !userAuthenticated &&
          <div className="section section-3">
            <Link route="/login">
              <a>
                <button className="button outline">Login</button>
              </a>
            </Link>
            <div style={{ marginRight: '10px' }} />
            <Link route="/signup">
              <a>
                <button className="button outline secondary">Signup</button>
              </a>
            </Link>
          </div>
        }
        { userAuthenticated &&
          <div className="section section-3">
            <div className="userName" >
              { currentUser.email }
            </div>
            <div style={{ marginLeft: '10px' }} />
            <a>
              <button
                className="button outline"
                onClick={this.onLogoutClick}
              >Logout</button>
            </a>
            <div style={{ marginLeft: '10px' }} />
            <Link route="/admin/plot-places">
              <a>
                <button className="button outline secondary">Plot Places</button>
              </a>
            </Link>
            <div style={{ marginLeft: '10px' }} />
            <Link route="/admin">
              <a>
                <button className="button outline secondary">Admin</button>
              </a>
            </Link>
          </div>
        }

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
          .userName {
            margin-top: 10px;
            overflow: hidden;
            text-overflow: ellipsis;
            max-width: 200px;
            white-space: nowrap;
          }
          .searchWrap {
            margin: 0 20px;
          }
          .search {

          }
        `}</style>
      </div>
    );
  }

}
export default Navbar;
