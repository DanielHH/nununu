import { GET_COMPANY_PRODUCTS_SUCCESS, GET_COMPANY_PRODUCTS_FAILURE } from './actions'

const initialProductsState = {
  products: [],
  error: '',
}

function products(state = initialProductsState, action) {
  switch (action.type) {
  case GET_COMPANY_PRODUCTS_SUCCESS:
    return {...state, products: action.data}
  case GET_COMPANY_PRODUCTS_FAILURE:
    return {...state, error: action.error}
  default:
    return state
  }
}

export const reducers = {
  products,
}
