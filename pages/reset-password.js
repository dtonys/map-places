import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'routes/pageRoutes';

import ResetPasswordForm from 'components/ResetPasswordForm';
import Layout from 'components/Layout';
import clientEntry from 'helpers/clientEntry';
import attachRedux from 'helpers/attachRedux';
import makeAction, {
  request,
} from 'helpers/reduxAction';
import {
  ACTION_RESET_PASSWORD,
} from 'redux-modules/actions/user';
import {
  extractResetPasswordErrorMessage,
} from 'redux-modules/reducers/user';


@clientEntry()
@attachRedux()
@connect(
  (globalState) => ({
    resetPasswordErrorMessage: extractResetPasswordErrorMessage(globalState),
  })
)
class ResetPasswordPage extends Component {
  static propTypes = {
    resetPasswordErrorMessage: PropTypes.string,
    dispatch: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      apiSuccess: false,
    };
  }

  submitForm = ( payload ) => {
    const sessionToken = window.location.search.split('sessionToken=')[1].split('&')[0];
    const payloadWithToken = {
      ...payload,
      sessionToken,
    };
    const resetPasswordPromise = this.props.dispatch( makeAction(
      request(ACTION_RESET_PASSWORD),
      payloadWithToken,
      { deferred: true },
    ) );
    resetPasswordPromise.then(() => {
      this.setState({
        apiSuccess: true,
      });
    });
  }

  render() {
    const {
      resetPasswordErrorMessage,
    } = this.props;
    const { apiSuccess } = this.state;

    return (
      <div>
        <Layout htmlTitle={'Reset Password'}>
          <div>
            <div style={{ marginTop: '50px' }} />
            { !apiSuccess &&
              <ResetPasswordForm
                onSubmit={ this.submitForm }
                serverErrorMessage={resetPasswordErrorMessage}
              />
            }
            { apiSuccess &&
              <div className="successWrap">
                <div className="messageWrap">
                  <div>{'You password was changed successfully'}</div>
                  <br />
                  <div>
                    {'Go to the '}
                    <Link route="/login">
                      <a href="/login">{'login page'}</a>
                    </Link>
                    {' to log in.'}
                  </div>
                  <br />
                  <Link route="/login">
                    <a>
                      <button
                        className="button w50"
                        data-test="submit"
                      >Login</button>
                    </a>
                  </Link>
                </div>
              </div>
            }
          </div>
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
        </Layout>
      </div>
    );
  }

}

export default ResetPasswordPage;
