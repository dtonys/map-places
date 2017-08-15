function isEmpty(value) {
  return (value === undefined || value === null || value === '');
}

export function required( value ) {
  if ( isEmpty(value) ) {
    return 'Required field';
  }
  return undefined;
}

export function email(value) {
  // Let's not start a debate on email regex. This is just for an example app!
  if (isEmpty(value) || !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
    // return 'email';
    return 'Invalid email';
  }
  return undefined;
}

export function containsLowerCase(value) {
  const test = /[a-z]/.test(value);
  if ( !test ) {
    // return 'containsLowerCase';
    return 'Must contain one lowercase letter';
  }
  return undefined;
}

export function containsUpperCase(value) {
  const test = /[A-Z]/.test(value);
  if ( !test ) {
    // return 'containsUpperCase';
    return 'Must contain one uppercase letter';
  }
  return undefined;
}

export function containsInteger(value) {
  const test = /[0-9]/.test(value);
  if ( !test ) {
    // return 'containsInteger';
    return 'Must contain one number';
  }
  return undefined;
}

export function truthy( value ) {
  if ( !value ) {
    // return 'truthy';
    return 'Must not be blank';
  }
  return undefined;
}

export function minLength(min, filterRegex) {
  return (value) => {
    if ( isEmpty(value) ) return value;
    let result = value;
    if ( filterRegex ) {
      result = result.replace(filterRegex, '');
    }
    if (result.length < min) {
      return `Must contain at least ${min} characters`;
    }
    return undefined;
  };
}

export function maxLength(max) {
  return (value) => {
    if (!isEmpty(value) && value.length > max) {
      return `Must contain no more than ${max} characters`;
    }
    return undefined;
  };
}

export function exactLength(len, filterRegex) {
  return (value) => {
    if ( isEmpty(value) ) return value;
    let result = value;
    if ( filterRegex ) {
      result = result.replace(filterRegex, '');
    }
    if (result.length !== len) {
      return `Must contain exactly ${len} characters`;
    }
    return undefined;
  };
}

// check if valid integer or double
export function isNumber( value ) {
  if ( isNaN( value ) ) {
    return 'Must be a valid number';
  }
  // check for a case such as `22.`, or `.`
  if ( /^([0-9]*\.)$/.test( value ) ) {
    return 'Must be a valid number';
  }
  return undefined;
}

export function integer(value) {
  if (!Number.isInteger(Number(value))) {
    return 'Must be a whole number';
  }
  return undefined;
}

export function zipcode(value) {
  const valueString = ( value && String(value) );
  if ( !/^[0-9]{5}$/.test(valueString) ) {
    return 'Must be a valid zipcode';
  }
  return undefined;
}

export function match(fieldName) {
  return (value, props) => {
    if (
      props.data.values &&
      props.data.values[fieldName] &&
      value !== props.data.values[fieldName]) {
      return `Must match ${fieldName}`;
    }
    return undefined;
  };
}


// Return a function which returns an object of error messages
export function createValidator( fieldToValidatorMap ) {
  return ( values, props ) => {
    const errors = {};
    Object.keys(fieldToValidatorMap).forEach(( key ) => {
      const validatorArray = fieldToValidatorMap[key];
      const errorArray = validatorArray
        .map((validator) => validator(values[key], props) )
        .filter((error) => !!error );
      if ( errorArray && errorArray.length ) {
        errors[key] = errorArray;
      }
    });
    return errors;
  };
}
