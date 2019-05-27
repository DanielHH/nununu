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

export const CREATE_COMPANY_SUCCESS = 'CREATE_COMPANY_SUCCESS'

export const CREATE_COMPANY_FAILURE = 'CREATE_COMPANY_FAILURE'

export const REMOVE_MENU = 'REMOVE_MENU'

export const GO_TO_CATEGORY = 'GO_TO_CATEGORY'

export const START_EDIT_PRODUCT = 'START_EDIT_PRODUCT'

export const START_ADD_PRODUCT = 'START_ADD_PRODUCT'

export const REORDER_PRODUCTS_SUCCESS = 'REORDER_PRODUCTS_SUCCESS'

export const REORDER_PRODUCTS_FAILURE = 'REORDER_PRODUCTS_FAILURE'

export const REORDER_CATEGORIES_SUCCESS = 'REORDER_CATEGORIES_SUCCESS'

export const REORDER_CATEGORIES_FAILURE = 'REORDER_CATEGORIES_FAILURE'







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
      token: res.data.token,
      showSuccessfulSignUp: false,
    })).catch(res => dispatch({
      type: SIGN_IN_USER_FAILURE,
      error: res,
    }))
  }
}

export function signUpUser(params){
  let credentials = params
  return async function (dispatch) {
    try {
      await apiClient.post('user/sign-up', credentials)
      try {
        const signInResponse = await apiClient.post('/user/sign-in', credentials)
        try {
          await apiClient.post('/company/create', credentials, {headers: { Authorization: signInResponse.data.token }})
          return dispatch({
            type: CREATE_COMPANY_SUCCESS,
            showSuccessfulSignUp: true,
          })
        } catch(error) {
          return dispatch({
            type: CREATE_COMPANY_FAILURE,
            error: error,
          })
        }
      } catch(error) {
        return dispatch({
          type: SIGN_IN_USER_FAILURE,
          error: error,
        })
      }
    } catch(error) {
      return dispatch({
        type: SIGN_UP_USER_FAILURE,
        error: error,
      })
    }
  }
}

export function emptyMenuState() {
  return { type: REMOVE_MENU }
}

export function getCompanyProductsWithToken(token) {
  apiClient.defaults.headers.common['Authorization'] = token
  return function (dispatch) {
    apiClient.get('/company/products')
    .then(res => dispatch({
      type: GET_COMPANY_PRODUCTS_SUCCESS,
      categories: res.data.categories,
      products: res.data.products,
    })).catch((res) => dispatch({
      type: GET_COMPANY_PRODUCTS_FAILURE,
      error: res,
    }))
  }
}

export function reorderCategories(reorderedCategories, token) {
  var i
  for (i = 0; i < reorderedCategories.length; i++) {
    reorderedCategories[i].position = i
  }
  let params = {'categories': reorderedCategories}
  apiClient.defaults.headers.common['Authorization'] = token
  return function (dispatch) {
    apiClient.post('/category/reorder', params)
    .then(() => dispatch({ 
      type: REORDER_CATEGORIES_SUCCESS, 
      reorderedCategories,
    })).catch(res => dispatch({
      type: REORDER_CATEGORIES_FAILURE,
      error: res,
    }))
  }
}

export function addCategory(categoryName, token) {
  let params = {'name': categoryName}
  apiClient.defaults.headers.common['Authorization'] = token
  return function (dispatch) {
    apiClient.post('/category/create', params)
    .then(res => dispatch({
      type: ADD_CATEGORY_SUCCESS,
      category: res.data,
    })).catch(res => dispatch({
      type: ADD_CATEGORY_FAILURE,
      error: res,
    }))
  }
}

export function showCategoryProducts(categoryId) {
  return { type: GO_TO_CATEGORY, categoryId}
}

export function reorderProducts(categoryId, reorderedProducts, token) {
  var i
  for (i = 0; i < reorderedProducts.length; i++) {
    reorderedProducts[i].position = i
  }
  let params = {'products': reorderedProducts}
  apiClient.defaults.headers.common['Authorization'] = token
  return function (dispatch) {
    apiClient.post('/product/reorder', params)
    .then(() => dispatch({ 
      type: REORDER_PRODUCTS_SUCCESS, 
      reorderedProducts,
      categoryId,
    })).catch(res => dispatch({
      type: REORDER_PRODUCTS_FAILURE,
      error: res,
    }))
  }
}

export function goToEditProduct(product) {
  return {type: START_EDIT_PRODUCT, product}
}

export function goToAddProduct() {
  return {type: START_ADD_PRODUCT }
}

export function editProduct(id, name, price, description, categoryId, token) {
  let editedProduct = {'id': id, 'name': name, 'price': price, 'categoryId': categoryId, 'description': description}
  apiClient.defaults.headers.common['Authorization'] = token
  return function (dispatch) {
    apiClient.post('/product/edit/' + id, editedProduct)
    .then(res => dispatch({ 
      type: EDIT_PRODUCT_SUCCESS, 
      editedProduct: res.data,
      categoryId: res.data.categoryId,
      id: res.data.id,
    })).catch(res => dispatch({
      type: EDIT_PRODUCT_FAILURE,
      error: res,
    }))
  }
}

export function addProduct(name, price, description, categoryId, token) {
  let newProduct = {'name': name, 'price': price, 'category': categoryId, 'description': description}
  apiClient.defaults.headers.common['Authorization'] = token
  return function (dispatch) {
    apiClient.post('/product/create', newProduct)
    .then(res => dispatch({ 
      type: ADD_PRODUCT_SUCCESS, 
      newProduct: res.data,
      categoryId: res.data.categoryId,
    })).catch(res => dispatch({
      type: ADD_PRODUCT_FAILURE,
      error: res,
    }))
  }
}

export function reorderCategory(newCategoriesOrder) {

}

export function changeProductCategory(id, name) {
}

export function removeProduct(id, name) {
}

export function removeCategory(id, name) {
}

