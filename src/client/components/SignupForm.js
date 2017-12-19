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


const SignupFormView = ({
  handleSubmit,
  serverErrorMessage,
}) => {
  return (
    <div className="formWrap">
      <form
        method="post"
        action=""
        className="form signupForm"
        onSubmit={handleSubmit}
      >
        <h3> Signup </h3>
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
          <div className="form-item">
            <button
              className="w50"
              data-test="submit"
            >Submit</button>
          </div>
        </fieldset>
      </form>
      <style jsx>{`
        .signupForm {
          max-width: 600px;
          margin: auto;
        }
        .formWrap {
          padding: 0 10px;
        }
      `}</style>
    </div>
  );
};
SignupFormView.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  serverErrorMessage: PropTypes.string,
};

const SignupForm = compose(
  reduxForm({
    form: 'signup',
    validate: createValidator({
      email: [ requiredValidator, emailValidator ],
      password: [ requiredValidator ],
    }),
  })
)(SignupFormView);

export default SignupForm;
