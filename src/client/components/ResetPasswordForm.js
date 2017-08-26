import React from 'react';
import PropTypes from 'prop-types';
import {
  Field as ReduxFormField,
  reduxForm,
} from 'redux-form';
import { compose } from 'recompose';
import {
  required as requiredValidator,
  createValidator,
} from 'mp-validation';
import TextInput from 'components/TextInput';


const ResetPasswordFormView = ({
  handleSubmit,
  serverErrorMessage,
}) => {
  return (
    <div className="formWrap">
      <form
        method="post"
        action=""
        className="form resetPasswordForm"
        onSubmit={handleSubmit}
      >
        <h3> Reset Password </h3>
        <fieldset>
          { serverErrorMessage &&
            <div className="error" style={{ marginBottom: '10px' }} >
              {serverErrorMessage}
            </div>
          }
          <ReduxFormField
            component={TextInput}
            label="Password"
            type="text"
            name="password"
            requiredStar
          />
          <ReduxFormField
            component={TextInput}
            label="Password Confirm"
            type="text"
            name="passwordConfirm"
            requiredStar
          />
          <div className="form-item">
            <button className="w50" >Submit</button>
          </div>
        </fieldset>
      </form>
      <style jsx>{`
        .resetPasswordForm {
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
ResetPasswordFormView.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  serverErrorMessage: PropTypes.string,
};

const ResetPasswordForm = compose(
  reduxForm({
    form: 'reset-password',
    validate: createValidator({
      password: [ requiredValidator ],
      passwordConfirm: [ requiredValidator ],
    }),
  })
)(ResetPasswordFormView);

export default ResetPasswordForm;
