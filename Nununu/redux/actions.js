import { apiClient } from '../apiClient'

/*
 * action types
 */

export const GET_COMPANY_PRODUCTS_SUCCESS = 'GET_COMPANY_PRODUCTS_SUCCESS'

export const GET_COMPANY_PRODUCTS_FAILURE = 'GET_COMPANY_PRODUCTS_FAILURE'

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
      error: response.error,
    }))
  }
}
