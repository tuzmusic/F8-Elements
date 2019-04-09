const initialState = {
  stations: [],
  user: null,
  isLoading: false,
  error: null
};

export default (authReducer = (state = initialState, action) => {
  switch (action.type) {
    case "LOGIN_START":
      return { ...state, isLoading: true };
    case "LOGIN_SUCCESS":
      console.log("Login succeeded");
      return { ...state, user: action.payload, isLoading: false };
    case "LOGIN_FAILURE":
      return { ...state, error: action.payload, isLoading: false };
    default:
      return state;
  }
});
