/**
 * @jest-environment node
 */


describe('nodejs environment tests', () => {
  test('A global and process object should exist', () => {
    expect(global).toBeTruthy();
    expect(process).toBeTruthy();
  });
});
