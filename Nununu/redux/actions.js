import { apiClient } from '../apiClient'

/*
 * action types
 */

export const GET_COMPANIES_SUCCESS = 'GET_COMPANIES_SUCCESS'

export const GET_COMPANIES_FAILURE = 'GET_COMPANIES_FAILURE'

export const SET_SELECTED_COMPANY = 'SET_SELECTED_COMPANY'

export const GET_COMPANY_PRODUCTS_SUCCESS = 'GET_COMPANY_PRODUCTS_SUCCESS'

export const GET_COMPANY_PRODUCTS_FAILURE = 'GET_COMPANY_PRODUCTS_FAILURE'

export const INCREASE_PRODUCT_QUANTITY = 'INCREASE_PRODUCT_QUANTITY'

export const DECREASE_PRODUCT_QUANTITY = 'DECREASE_PRODUCT_QUANTITY'

export const POST_PURCHASE_SUCCESS = 'POST_PURCHASE_SUCCESS'

export const POST_PURCHASE_FAILURE = 'POST_PURCHASE_FAILURE'

export const START_PAY_SWISH_SUCCESS = 'START_PAY_SWISH_SUCCESS'

export const START_PAY_SWISH_FAILURE = 'START_PAY_SWISH_FAILURE'

export const MAKE_PURCHASE_COMPLETED = 'MAKE_PURCHASE_COMPLETED'

export const SET_PURCHASER_ID = 'SET_PURCHASER_ID'

/*
 * action creators
 */

export function getCompanies() {
  return function(dispatch) {
    apiClient.get('/companies')
    .then((response) => dispatch({
      type: GET_COMPANIES_SUCCESS,
      data: response.data.companies,
    })).catch((response) => dispatch({
      type: GET_COMPANIES_FAILURE,
      error: response,
    }))
  }
}

export function setSelectedCompany(company) {
  return { type: SET_SELECTED_COMPANY, company}
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

export function increaseProductQuantity(index, sectionTitle) {
  return { type: INCREASE_PRODUCT_QUANTITY, index, sectionTitle}
}

export function decreaseProductQuantity(index, sectionTitle) {
  return { type: DECREASE_PRODUCT_QUANTITY, index, sectionTitle}
}

export function postPurchase(purchase) {
  return function (dispatch) {
    apiClient.post('/purchase', purchase)
    .then((response) => dispatch({
      type: POST_PURCHASE_SUCCESS,
      purchase: response.data,
    })).catch((response) => dispatch({
      type: POST_PURCHASE_FAILURE,
      error: response,
    }))
  }
}

export function startPaySwish(purchaseId) {
  return function (dispatch) {
    apiClient.post('/pay/swish/' + purchaseId)
    .then((response) => {
      if (response.data['payment_skipped'] === true) {
        return
      } else {
        return dispatch({
          type: START_PAY_SWISH_SUCCESS,
          requestToken: response.data['request_token'],
        })
      }
    }).catch((response) => dispatch({
      type: START_PAY_SWISH_FAILURE,
      error: response,
    }))
  }
}

export function makePurchaseCompleted(purchaseId) {
  return { type: MAKE_PURCHASE_COMPLETED, purchaseId: purchaseId}
}

export function setPurchaserId(purchaserId) {
  return { type: SET_PURCHASER_ID, purchaserId: purchaserId}
}
