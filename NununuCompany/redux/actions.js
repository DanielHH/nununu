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

export const EDIT_PRODUCT_SUCCESS = 'EDIT_PRODUCT_SUCCESS'

export const EDIT_PRODUCT_FAILURE = 'EDIT_PRODUCT_FAILURE'

export const CHANGE_PRODUCT_ORDER = 'CHANGE_PRODUCT_ORDER'

export const ADD_CATEGORY_SUCCESS = 'ADD_CATEGORY_SUCCESS'

export const ADD_CATEGORY_FAILURE = 'ADD_CATEGORY_FAILURE'

export const GET_COMPANY_PRODUCTS_SUCCESS = 'GET_COMPANY_PRODUCTS_SUCCESS'

export const GET_COMPANY_PRODUCTS_FAILURE = 'GET_COMPANY_PRODUCTS_FAILURE'

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

export function getCompanyProducts(companyId) {
  return function (dispatch) {
    apiClient.get('/company/'+companyId+'/products')
    .then((response) => dispatch({
      type: GET_COMPANY_PRODUCTS_SUCCESS,
      categories: response.data.categories,
      products: response.data.products,
    })).catch((response) => dispatch({
      type: GET_COMPANY_PRODUCTS_FAILURE,
      error: response,
    }))
  }
}

export function addProduct(id, name, price, description, category, token) {
  let new_product = {'id': id, 'name': name, 'price': price, 'category': category, 'description': description}
  apiClient.defaults.headers.common['Authorization'] = token
  return function (dispatch) {
    apiClient.post('/product/create', new_product)
    .then(() => dispatch({ 
      type: ADD_PRODUCT_SUCCESS, 
      new_product,
      category,
    })).catch(res => dispatch({
      type: ADD_PRODUCT_FAILURE,
      error: res,
    }))
  }
}

export function editProduct(id, name, price, description, category, token) {
  let edited_product = {'id': id, 'name': name, 'price': price, 'category': category, 'description': description}
  apiClient.defaults.headers.common['Authorization'] = token
  return function (dispatch) {
    apiClient.post('/product/edit/' + id, edited_product)
    .then(() => dispatch({ 
      type: EDIT_PRODUCT_SUCCESS, 
      edited_product,
      category,
      id,
    })).catch(res => dispatch({
      type: EDIT_PRODUCT_FAILURE,
      error: res,
    }))
  }
}

export function reOrderProducts(category, newProductsOrder) {

}

export function reOrderCategory(newCategoriesOrder) {

}

export function addCategory(id, categoryName) {

}

export function changeProductCategory(id, name) {
}

export function removeProduct(id, name) {
}

export function removeCategory(id, name) {
}

