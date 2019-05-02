import { apiClient } from '../apiClient'
import axios from 'axios'
/*
 * action types
 */

export const SET_ACTIVE_ORDERS = 'SET_ACTIVE_ORDERS'

export const SET_COMPLETED_ORDERS = 'SET_COMPLETED_ORDERS'

export const COMPLETE_ORDER = 'COMPLETE_ORDER'

export const SAVE_TOKEN = 'SAVE_TOKEN'

export const REMOVE_TOKEN = 'REMOVE_TOKEN'

export const SIGN_IN_USER_SUCCESS = 'SIGN_IN_USER_SUCCESS'

export const SIGN_IN_USER_FAILURE = 'SIGN_IN_USER_FAILURE'

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

export function saveToken(token) {
  return { type: SAVE_TOKEN, token }
}

export function removeToken() {
  return { type: REMOVE_TOKEN }
}

/*export function signInUser(email, password){
  console.log(email, password)
  return function (dispatch) {
    apiClient.post('/user/sign-in', {
      email: email,
      password: password,
    }).then(res => dispatch({
      type: SIGN_IN_USER_SUCCESS,
      token: res.data,
    })).catch(res => dispatch({
      type: SIGN_IN_USER_FAILURE,
      error: res,
    }))
  }
}*/

export function signInUser(email, password){
  console.log(email, password)
  let credentials = {'email': email, 'password': password}
  return function (dispatch) {
    apiClient.post('/user/sign-in', credentials)
    .then(res => dispatch({
      type: SIGN_IN_USER_SUCCESS,
      token: res.data,
    })).catch(res => dispatch({
      type: SIGN_IN_USER_FAILURE,
      error: res,
    }))
}
}
