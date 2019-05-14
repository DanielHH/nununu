import { apiClient } from '../apiClient'
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

export const START_NEW_SIGNUP = 'START_NEW_SIGNUP'

export const ADD_PRODUCT_SUCCESS = 'ADD_PRODUCT_SUCCESS'

export const ADD_PRODUCT_FAILURE = 'ADD_PRODUCT_FAILURE'

export const REMOVE_PRODUCT = 'REMOVE_PRODUCT'

export const EDIT_PRODUCT_INFO = 'EDIT_PRODUCT_INFO'

export const CHANGE_PRODUCT_ORDER = 'CHANGE_PRODUCT_ORDER'

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

export function startNewSignUp() {
  return { type: START_NEW_SIGNUP }
}

export function signInUser(email, password) {
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

export function signUpUser(email, password) {
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

export function addProduct(id, name, price, description, token) {
  let new_product = {'id': id, 'name': name, 'price': price, 'description': description}
  apiClient.defaults.headers.common['Authorization'] = token
  return function (dispatch) {
    apiClient.post('/product/create', new_product)
    .then(() => dispatch({ 
      type: ADD_PRODUCT_SUCCESS, 
      new_product,
    })).catch(res => dispatch({
      type: ADD_PRODUCT_FAILURE,
      error: res,
    }))
  }
}
