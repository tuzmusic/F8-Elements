import axios from "axios";

export const ApiUrls = {
  Login: "http://joinelectro.com/wp-json/auth/login"
};

export function assignUser(user) {
  return async dispatch => {
    await dispatch({ type: "LOGIN_SUCCESS", user });
    dispatch({ type: "SAVE_USERS" });
  };
}

export function logout() {
  return { type: "LOGOUT" };
}

export function login() {
  return dispatch => {
    dispatch({ type: "LOGIN_START" });
    fetch("http://127.0.0.1:3000/users") // this will need to be a POST session (not a GET user)
      .then(res => res.json())
      .then(users => {
        console.log("Login succeeded");
        dispatch({ type: "LOGIN_SUCCESS", user: users[0] });
      })
      .catch(error => {
        console.warn("login failed");
        dispatch({ type: "LOGIN_FAILURE", error });
      });
  };
}

import { put, call, takeEvery } from "redux-saga/effects";

function loginApi(creds) {
  console.log(creds);
  return axios.get(ApiUrls.login, { params: creds });
}

export function* loginSaga({ username, password }) {
  try {
    let { data } = yield call(loginApi, { username, password });
    console.log(data);
    yield put({ type: "LOGIN_SUCCESS", user: res });
  } catch (error) {
    yield put({ type: "LOGIN_FAILURE", error });
  }
}

export function* watchLogin() {
  yield takeEvery("LOGIN_START", loginSaga);
}
