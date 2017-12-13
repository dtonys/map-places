/**
 * @jest-environment jsdom
 */


describe('jsDom environment tests', () => {
  test('A window and document object should exist', () => {
    expect(window).toBeTruthy();
    expect(document).toBeTruthy();
  });
});
