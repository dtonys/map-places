import { Component } from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import { compose } from 'recompose';
import classnames from 'classnames';

import Layout from 'components/Layout';
import clientEntry from 'helpers/clientEntry';
import attachRedux from 'helpers/attachRedux';
import {
  required as requiredValidator,
  email as emailValidator,
  createValidator,
} from 'mp-validation';

const mockSubmit = (event) => { event.preventDefault(); };

const TextInput = ({
  input,
  meta,
  label,
  type,
  requiredStar,
}) => {

  const showError = ( meta.error && meta.touched );
  const inputClass = classnames(
    showError && 'error'
  );
  return (
    <div className="form-item">
      <label>
        { label }
        { requiredStar &&
          <span
            className="req"
            style={{ marginLeft: '2px' }} >
            {'*'}</span>
        }
      </label>
      <input
        {...input}
        type={type}
        className={inputClass}
      />
      { showError &&
        <span className="error">{ meta.error[0] }</span>
      }

    </div>
  );
};
TextInput.propTypes = {
  input: PropTypes.object.isRequired,
  meta: PropTypes.object.isRequired,
  label: PropTypes.string,
  type: PropTypes.string,
  requiredStar: PropTypes.bool,
};

const SignupFormView = () => {
  return (
    <div className="formWrap">
      <form method="post" action="" className="form signupForm" onSubmit={mockSubmit} >
        <h3> Signup </h3>
        <fieldset>
          <Field
            component={TextInput}
            label="Email"
            type="email"
            name="email"
            requiredStar
          />
          <Field
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
    </div>
  );
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

@clientEntry()
@attachRedux()
@reduxForm({
  form: 'signup',
})
class SignupPage extends Component {
  render() {
    return (
      <div>
        <Layout htmlTitle={'Signup'}>
          <div>
            <div style={{ marginTop: '50px' }} />
            <SignupForm />
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
        </Layout>
      </div>
    );
  }
}

export default SignupPage;
