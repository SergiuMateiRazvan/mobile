import React, {useCallback, useReducer} from 'react';
import {getLogger, login, setToken} from '../core';
import {Provider} from './context';
import {AsyncStorage} from 'react-native';
const log = getLogger('AuthStore');

const TOKEN_KEY = 'TOKEN';

const SET_TOKEN = 'SET_TOKEN';
const SIGN_IN_STARTED = 'SIGN_IN_STARTED';
const SIGN_IN_SUCCEEDED = 'SIGN_IN_SUCCEEDED';
const SIGN_IN_FAILED = 'SIGN_IN_FAILED';

const initialState = {
  token: null,
  loginError: null,
  loginInProgress: false,
};

function reducer(state, action) {
  log('reducer', action);
  const {type, payload} = action;
  switch (type) {
    case SET_TOKEN:
      return {...state, token: payload.token};
    case SIGN_IN_STARTED:
      return {...state, loginError: null, loginInProgress: true};
    case SIGN_IN_SUCCEEDED:
      return {...state, token: payload.token, loginInProgress: false};
    case SIGN_IN_FAILED:
      return {...state, loginError: payload.error, loginInProgress: false};
    default:
      return state;
  }
}

export const AuthStore = ({children}) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const onLoadToken = useCallback(async () => {
    log('loadToken...');
    let token = null;
    try {
      const value = await AsyncStorage.getItem(TOKEN_KEY);
      token = value || null;
      log('loadToken succeeded', token, value);
    } catch (error) {
      log('loadToken error', error);
    }
    setToken(token);
    dispatch({type: SET_TOKEN, payload: {token}});
    return Promise.resolve(token);
  }, []);

  const onLogin = useCallback(async (username, password) => {
    log('loadToken...');
    dispatch({type: SIGN_IN_STARTED});
    return login(username, password)
      .then(tokenHolder => {
        log('LoggedIn..');
        const token = tokenHolder.token;
        dispatch({type: SIGN_IN_SUCCEEDED, payload: {token}});
        setToken(token);
        AsyncStorage.setItem(TOKEN_KEY, token).catch(error => {
          log('saveToken error', error);
        });
        return token;
      })
      .catch(error => {
        dispatch({type: SIGN_IN_FAILED, payload: {error}});
        return Promise.reject(error);
      });
  }, []);

  const onLogout = useCallback(async () => {
    log('removeToken');
    try {
      await AsyncStorage.removeItem(TOKEN_KEY);
      log('token removed');
    } catch (error) {
      log('token remove error', error);
    }
    setToken(null);
    dispatch({type: SET_TOKEN, payload: {token: null}});
    return Promise.resolve(null);
  });

  const value = {...state, onLoadToken, onLogin, onLogout};
  log('render', value);
  return <Provider value={value}>{children}</Provider>;
};
