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


const LostPasswordFormView = ({
  handleSubmit,
  serverErrorMessage,
}) => {
  return (
    <div className="formWrap">
      <form
        method="post"
        action=""
        className="form lostPasswordForm"
        onSubmit={handleSubmit}
      >
        <h3> Lost Password </h3>
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
          <div className="form-item">
            <button className="w50" >Submit</button>
          </div>
        </fieldset>
      </form>
      <style jsx>{`
        .lostPasswordForm {
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
LostPasswordFormView.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  serverErrorMessage: PropTypes.string,
};

const LostPasswordForm = compose(
  reduxForm({
    form: 'lost-password',
    validate: createValidator({
      email: [ requiredValidator, emailValidator ],
    }),
  })
)(LostPasswordFormView);

export default LostPasswordForm;
