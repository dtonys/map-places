import * as validation from '../mp-validation';


describe('Validator tests', () => {

  test('required', () => {
    expect(validation.required('')).toBeTruthy();
    expect(validation.required('asdf')).toBeUndefined();
  });

  test('email', () => {
    expect(validation.email('')).toBeTruthy();
    expect(validation.email('asdf')).toBeTruthy();
    expect(validation.email('something@gmail.com')).toBeUndefined();
  });

  test('containsLowerCase', () => {
    expect(validation.containsLowerCase('ABCD')).toBeTruthy();
    expect(validation.containsLowerCase('aBCD')).toBeUndefined();
  });

  test('containsUpperCase', () => {
    expect(validation.containsUpperCase('abcd')).toBeTruthy();
    expect(validation.containsUpperCase('Abcd')).toBeUndefined();
  });

  test('containsInteger', () => {
    expect(validation.containsInteger('abcd')).toBeTruthy();
    expect(validation.containsInteger('1bcd')).toBeUndefined();
  });

  test('truthy', () => {
    expect(validation.truthy(null)).toBeTruthy();
    expect(validation.truthy(undefined)).toBeTruthy();
    expect(validation.truthy(0)).toBeTruthy();

    expect(validation.truthy(true)).toBeUndefined();
    expect(validation.truthy('abcd')).toBeUndefined();
    expect(validation.truthy(-1)).toBeUndefined();
    expect(validation.truthy(100)).toBeUndefined();
  });

  test('minLength', () => {
    const min5 = validation.minLength(5);
    expect(min5).toBeInstanceOf(Function);
    expect(min5('abc')).toBeTruthy();
    expect(min5('abcdef')).toBeUndefined();
  });

  test('maxLength', () => {
    const max5 = validation.maxLength(5);
    expect(max5).toBeInstanceOf(Function);
    expect(max5('abcdef')).toBeTruthy();
    expect(max5('abcd')).toBeUndefined();
  });

  test('exactLength', () => {
    const exact5 = validation.exactLength(5);
    expect(exact5).toBeInstanceOf(Function);
    expect(exact5('abc')).toBeTruthy();
    expect(exact5('abcdefg')).toBeTruthy();
    expect(exact5('abcde')).toBeUndefined();
  });

  test('isNumber', () => {
    expect(validation.isNumber('abc')).toBeTruthy();
    expect(validation.isNumber('abc123')).toBeTruthy();
    expect(validation.isNumber('123')).toBeUndefined();
  });

  test('integer', () => {
    expect(validation.integer('abc')).toBeTruthy();
    expect(validation.integer('abc123')).toBeTruthy();
    expect(validation.integer('123')).toBeUndefined();
  });

  test('zipcode', () => {
    expect(validation.zipcode('abcde')).toBeTruthy();
    expect(validation.zipcode('007')).toBeTruthy();
    expect(validation.zipcode('94061')).toBeUndefined();
  });

});
