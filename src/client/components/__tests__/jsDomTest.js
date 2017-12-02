/**
 * @jest-environment jsdom
 */


describe('User API tests', () => {
  test('A window and document object should exist', () => {
    expect(window).toBeTruthy();
    expect(document).toBeTruthy();
  });
});
