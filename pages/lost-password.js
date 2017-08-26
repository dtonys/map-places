import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Layout from 'components/Layout';
import clientEntry from 'helpers/clientEntry';
import attachRedux from 'helpers/attachRedux';

import LostPasswordForm from 'components/LostPasswordForm';
import makeAction, {
  request,
} from 'helpers/reduxAction';
import {
  ACTION_LOST_PASSWORD,
} from 'redux-modules/actions/user';
import {
  extractLostPasswordErrorMessage,
} from 'redux-modules/reducers/user';


@clientEntry()
@attachRedux()
@connect(
  (globalState) => ({
    lostPasswordErrorMessage: extractLostPasswordErrorMessage(globalState),
  })
)
class LostPasswordPage extends Component {
  static propTypes = {
    lostPasswordErrorMessage: PropTypes.string,
    dispatch: PropTypes.func.isRequired,
  }

  constructor( props ) {
    super(props);
    this.state = {
      apiSuccess: false,
    };
  }

  submitForm = ( payload ) => {
    const lostPasswordPromise = this.props.dispatch( makeAction(
      request(ACTION_LOST_PASSWORD),
      payload,
      { deferred: true },
    ) );
    lostPasswordPromise.then(() => {
      this.setState({
        apiSuccess: true,
      });
    });
  }

  render() {
    const {
      lostPasswordErrorMessage,
    } = this.props;
    const { apiSuccess } = this.state;

    return (
      <div>
        <Layout htmlTitle={'Lost Password'}>
          <div>
            <div style={{ marginTop: '50px' }} />
            { !apiSuccess &&
              <LostPasswordForm
                onSubmit={ this.submitForm }
                serverErrorMessage={lostPasswordErrorMessage}
              />
            }
            { apiSuccess &&
              <div className="successWrap">
                <div className="messageWrap">
                  <div>{'Request submitted.'}</div>
                  <br />
                  <div>{'Check your email to reset your password.'}</div>
                </div>
              </div>
            }
          </div>
        </Layout>
        <style jsx>{`
          .successWrap {
            width: 600px;
            margin: auto;
          }
          .messageWrap {
            border: 1px solid rgba(0,0,0,.1);
            text-align: center;
            padding: 2rem;
          }
        `}</style>
      </div>
    );
  }

}

export default LostPasswordPage;
