import { apiClient } from '../apiClient'
import axios from 'axios'
/*
 * action types
 */

export const SET_ACTIVE_ORDERS = 'SET_ACTIVE_ORDERS'

export const SET_COMPLETED_ORDERS = 'SET_COMPLETED_ORDERS'

export const COMPLETE_ORDER = 'COMPLETE_ORDER'

export const REMOVE_TOKEN = 'REMOVE_TOKEN'

export const SIGN_IN_USER_SUCCESS = 'SIGN_IN_USER_SUCCESS'

export const SIGN_IN_USER_FAILURE = 'SIGN_IN_USER_FAILURE'

export const SIGN_UP_USER_SUCCESS = 'SIGN_UP_USER_SUCCESS'

export const SIGN_UP_USER_FAILURE = 'SIGN_UP_USER_FAILURE'

export const HIDE_SUCCESSFUL_SIGN_UP_TEXT = 'HIDE_SUCCESSFUL_SIGN_UP_TEXT'

/*
 * other constants
 */


/*
 * action creators
 */

export function setActiveOrders(orders) {
  return { type: SET_ACTIVE_ORDERS, orders}
}

export function setCompletedOrders(orders) {
  return { type: SET_COMPLETED_ORDERS, orders}
}

export function completeOrder(orderId) {
  return { type: COMPLETE_ORDER, orderId}
}

export function removeToken() {
  return { type: REMOVE_TOKEN }
}

export function hideSuccessfulSignUpText() {
    return { type: HIDE_SUCCESSFUL_SIGN_UP_TEXT }
}

export function signInUser(email, password){
  let credentials = {'email': email, 'password': password}
  return function (dispatch) {
    apiClient.post('/user/sign-in', credentials)
    .then(res => dispatch({
      type: SIGN_IN_USER_SUCCESS,
      token: res.data,
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
