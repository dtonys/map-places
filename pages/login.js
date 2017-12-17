import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Layout from 'components/Layout';
import clientEntry from 'helpers/clientEntry';
import attachRedux from 'helpers/attachRedux';
import makeAction, {
  request,
} from 'helpers/reduxAction';
import {
  ACTION_LOGIN,
} from 'redux-modules/actions/user';
import LoginForm from 'components/LoginForm';
import {
  extractLoginErrorMessage,
} from 'redux-modules/reducers/user';


@clientEntry()
@attachRedux()
@connect(
  (globalState) => ({
    loginErrorMessage: extractLoginErrorMessage(globalState),
  })
)
class LoginPage extends Component {
  static propTypes = {
    loginErrorMessage: PropTypes.string,
    url: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
  }

  submitLogin = ( values ) => {
    // const nextPath = this.props.url.query.next
    const nextPath = this.props.url.query.next;

    // TODO(@dtonys): Consider directly dispatching actions
    // this.props.dispatch({
    //   type: request(ACTION_LOGIN),
    //   payload: {
    //     email: values.email,
    //     password: values.password,
    //     nextPath: nextPath,
    //   },
    //   meta: {},
    // });

    this.props.dispatch( makeAction(
      request(ACTION_LOGIN),
      {
        email: values.email,
        password: values.password,
        nextPath: nextPath,
      },
    ) );
  }

  render() {
    const {
      loginErrorMessage,
    } = this.props;

    return (
      <div>
        <Layout htmlTitle={'Login'}>
          <div>
            <div style={{ marginTop: '50px' }} />
            <LoginForm
              onSubmit={ this.submitLogin }
              serverErrorMessage={loginErrorMessage}
            />
          </div>
        </Layout>
      </div>
    );
  }
}

export default LoginPage;
