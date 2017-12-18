import React from 'react';
import PropTypes from 'prop-types';

import classnames from 'classnames';


const TextInput = ({
  input,
  meta,
  label,
  type,
  requiredStar,
}) => {

  const showErrorMessage = ( meta.error && meta.touched );
  const showErrorClass = ( meta.error && meta.touched && !meta.active );
  const inputClass = classnames(
    showErrorClass && 'error'
  );
  return (
    <div className="form-item">
      {/* JSON.stringify(meta) */}
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
        data-test={input.name}
      />
      { showErrorMessage && <div className="error smaller">{meta.error[0]}</div> }
      { /* showError &&
        meta.error.map((errorMessage) => (<div className="error smaller">{errorMessage}</div>) )
      */}

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

export default TextInput;
