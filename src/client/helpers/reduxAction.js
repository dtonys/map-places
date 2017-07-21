export default function makeAction( type, payload, meta = {} ) {
  return {
    type,
    payload,
    meta,
  };
}
