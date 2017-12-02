/**
 * @jest-environment node
 */


describe('User API tests', () => {
  test('A window and document object should exist', () => {
    expect(global).toBeTruthy();
    expect(process).toBeTruthy();
  });
});
