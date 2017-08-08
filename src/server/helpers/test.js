export function nextMock() {  // eslint-disable-line
  return {
    prepare: () => Promise.resolve(),
    getRequestHandler: () => (req, res) => res.send('Welcome to Next.js!'),
  };
}
