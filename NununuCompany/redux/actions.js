import { apiClient } from '../apiClient'
/*
 * action types
 */

export const COMPLETE_PURCHASE_SUCCESS = 'COMPLETE_PURCHASE_SUCCESS'

export const COMPLETE_PURCHASE_FAILURE = 'COMPLETE_PURCHASE_FAILURE'

export const REMOVE_TOKEN = 'REMOVE_TOKEN'

export const SIGN_IN_USER_SUCCESS = 'SIGN_IN_USER_SUCCESS'

export const SIGN_IN_USER_FAILURE = 'SIGN_IN_USER_FAILURE'

export const SIGN_UP_USER_SUCCESS = 'SIGN_UP_USER_SUCCESS'

export const SIGN_UP_USER_FAILURE = 'SIGN_UP_USER_FAILURE'

export const START_NEW_SIGNUP = 'START_NEW_SIGNUP'

/*
 * other constants
 */


/*
 * action creators
 */

export function completePurchase(purchaseId, token) {
  return function(dispatch) {
    apiClient.post('/purchase/makecompleted/' + String(purchaseId), null, {
      headers: { 'Authorization': token },
    })
    .then(res => dispatch({
      type: COMPLETE_PURCHASE_SUCCESS,
      purchase: res.data,
    })).catch(res => dispatch({
      type: COMPLETE_PURCHASE_FAILURE,
      error: res,
    }))
  }
}

export function removeToken() {
  return { type: REMOVE_TOKEN }
}

export function startNewSignUp() {
  return { type: START_NEW_SIGNUP }
}

export function signInUser(email, password){
  let credentials = {'email': email, 'password': password}
  return function (dispatch) {
    apiClient.post('/user/sign-in', credentials)
    .then(res => dispatch({
      type: SIGN_IN_USER_SUCCESS,
      token: res.data.token,
      showSuccessfulSignUp: false,
    })).catch(res => dispatch({
      type: SIGN_IN_USER_FAILURE,
      error: res,
    }))
  }
}

export function signUpUser(email, password){
  let credentials = {'email': email, 'password': password}
  return function (dispatch) {
    apiClient.post('/user/sign-up', credentials)
    .then(() => dispatch({
      type: SIGN_UP_USER_SUCCESS,
      showSuccessfulSignUp: true,
    })).catch(res => dispatch({
      type: SIGN_UP_USER_FAILURE,
      error: res,
    }))
  }
}
