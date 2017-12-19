export function _() {}
export function getMockUrlProp( pathname ) {
  return {
    query: {},
    pathname: pathname,
    asPath: pathname,
  };
}
