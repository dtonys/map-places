export const initialState = {
  loading: false,
  loaded: false,
  error: null,
};

function reducer( state = initialState, action ) {
  const actionSuffix = action.type.split('/')[2];
  if ( !actionSuffix ) {
    return state;
  }

  if ( ~actionSuffix.toLowerCase().indexOf('start') ) {
    return {
      ...state,
      loading: true,
    };
  }
  if ( ~actionSuffix.toLowerCase().indexOf('success') ) {
    return {
      ...state,
      loaded: true,
      loading: false,
      error: null,
    };
  }
  if ( ~actionSuffix.toLowerCase().indexOf('error') ) {
    return {
      ...state,
      loading: false,
      error: action.payload,
    };
  }
  return state;
}

export default reducer;

