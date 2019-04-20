import { apiClient } from '../apiClient'

/*
 * action types
 */

export const GET_COMPANY_PRODUCTS_SUCCESS = 'GET_COMPANY_PRODUCTS_SUCCESS'

export const GET_COMPANY_PRODUCTS_FAILURE = 'GET_COMPANY_PRODUCTS_FAILURE'

export const INCREASE_PRODUCT_QUANTITY = 'INCREASE_PRODUCT_QUANTITY'

export const DECREASE_PRODUCT_QUANTITY = 'DECREASE_PRODUCT_QUANTITY'

/*
 * action creators
 */

export function getCompanyProducts(companyId) {
  return function (dispatch) {
    apiClient.get('company/'+companyId+'/products')
    .then((response) => dispatch({
      type: GET_COMPANY_PRODUCTS_SUCCESS,
      data: response.data.products,
    })).catch((response) => dispatch({
      type: GET_COMPANY_PRODUCTS_FAILURE,
      error: response,
    }))
  }
}

export function increaseProductQuantity(product) {
  return { type: INCREASE_PRODUCT_QUANTITY, product}
}

export function decreaseProductQuantity(product) {
  return { type: DECREASE_PRODUCT_QUANTITY, product}
}
