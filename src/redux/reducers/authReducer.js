import { AsyncStorage } from "react-native";

export const initialState = {
  stations: [],
  user: null,
  isLoading: false,
  error: null,
  users: {}
};

export default (authReducer = (
  state = initialState,
  { user, users, error, ...action }
) => {
  console.log(action.type);

  switch (action.type) {
    case "LOGIN_START":
    case "LOGOUT_START":
    case "REGISTRATION_START":
      return { ...state, isLoading: true };
    case "LOGIN_SUCCESS":
      return {
        ...state,
        user,
        isLoading: false
      };
    case "REGISTRATION_SUCCESS":
      return { ...state, user, isLoading: false };
    case "LOGOUT_SUCCESS":
      return { ...state, user: null, isLoading: false };
    case "LOGIN_FAILURE":
    case "LOGOUT_FAILURE":
    case "REGISTRATION_FAILURE":
      return { ...state, error, isLoading: false };
    case "GET_USERS":
      return { ...state, users };
    case "SAVE_USERS":
      const data = { users: state.users, savedDate: new Date() };
      const storageString = JSON.stringify(data);
      AsyncStorage.setItem("electro_users", storageString);
      return state;
    default:
      return state;
  }
});
