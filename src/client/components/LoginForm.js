import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'routes/pageRoutes';
import {
  Field as ReduxFormField,
  reduxForm,
} from 'redux-form';
import { compose } from 'recompose';
import {
  required as requiredValidator,
  email as emailValidator,
  createValidator,
} from 'mp-validation';
import TextInput from 'components/TextInput';


const LoginFormView = ({
  handleSubmit,
  serverErrorMessage,
}) => {
  return (
    <div className="formWrap">
      <form
        method="post"
        action=""
        className="form loginForm"
        onSubmit={handleSubmit}
      >
        <h3> Login </h3>
        <fieldset>
          { serverErrorMessage &&
            <div
              className="error"
              style={{ marginBottom: '10px' }}
              data-test="serverError"
            >
              {serverErrorMessage}
            </div>
          }
          <ReduxFormField
            component={TextInput}
            label="Email"
            type="email"
            name="email"
            requiredStar
          />
          <ReduxFormField
            component={TextInput}
            label="Password"
            type="password"
            name="password"
            requiredStar
          />
          <div className="form-item row">
            <button
              className="col col-6"
              data-test="submit"
            >Submit</button>
            <div className="col col-6 forgotPassword">
              <Link route="/lost-password">
                <a className="forgotPasswordLink" >Forgot your password?</a>
              </Link>
            </div>
          </div>
        </fieldset>
      </form>
      <style jsx>{`
        .forgotPassword {
          text-align: center;
          padding-top: 5px;
        }
        .forgotPasswordLink {
          text-decoration: none;
          font-size: 14px;
        }
        .loginForm {
          width: 600px;
          margin: auto;
        }
        .formWrap {
          padding: 0 10px;
        }
      `}</style>
    </div>
  );
};
LoginFormView.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  serverErrorMessage: PropTypes.string,
};

const LoginForm = compose(
  reduxForm({
    form: 'login',
    validate: createValidator({
      email: [ requiredValidator, emailValidator ],
      password: [ requiredValidator ],
    }),
  })
)(LoginFormView);

export default LoginForm;
