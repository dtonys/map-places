import React from 'react';
import PropTypes from 'prop-types';
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
            <div className="error" style={{ marginBottom: '10px' }} >
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
          <div className="form-item">
            <button className="w50" >Submit</button>
          </div>
        </fieldset>
      </form>
      <style jsx>{`
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
