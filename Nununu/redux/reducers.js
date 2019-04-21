import { GET_COMPANY_PRODUCTS_SUCCESS, GET_COMPANY_PRODUCTS_FAILURE,
  INCREASE_PRODUCT_QUANTITY, DECREASE_PRODUCT_QUANTITY, POST_PURCHASE_SUCCESS,
  POST_PURCHASE_FAILURE, START_PAY_SWISH_SUCCESS, START_PAY_SWISH_FAILURE } from './actions'

const initialStoreState = {
  sections: [],
  error: '',
}

function store(state = initialStoreState, action) {
  switch (action.type) {
  case GET_COMPANY_PRODUCTS_SUCCESS: {
    let products_copy = [...action.data]
    let new_sections = []
    for (let i = 0; i<products_copy.length; i++) {
      products_copy[i].quantity = 0
      let added_to_section = false
      for (let j = 0; j<new_sections.length; j++) {
        if (new_sections[j].title == products_copy[i].category) {
          new_sections[j].data.push(products_copy[i])
          added_to_section = true
        }
      }
      if (!added_to_section) {
        new_sections.push({'title': products_copy[i].category, 'data': [products_copy[i]]})
      }
    }
    return {...state, sections: new_sections}
  }
  case GET_COMPANY_PRODUCTS_FAILURE:
    return {...state, error: action.error}
  case INCREASE_PRODUCT_QUANTITY: {
    let new_sections = [...state.sections] // clone data
    for (let i = 0; i<new_sections.length; i++) {
      if (new_sections[i].title == action.product.category) {
        for (let j = 0; j<new_sections[i].data.length; j++) {
          if (new_sections[i].data[j].id == action.product.id) {
            new_sections[i].data[j].quantity += 1
          }
        }
      }
    }
    return {...state, sections: new_sections}
  }
  case DECREASE_PRODUCT_QUANTITY: {
    let new_sections = [...state.sections] // clone data
    for (let i = 0; i<new_sections.length; i++) {
      if (new_sections[i].title == action.product.category) {
        for (let j = 0; j<new_sections[i].data.length; j++) {
          if (new_sections[i].data[j].id == action.product.id) {
            if (new_sections[i].data[j].quantity > 0) {
              new_sections[i].data[j].quantity -= 1
            }
          }
        }
      }
    }
    return {...state, sections: new_sections}
  }
  default:
    return state
  }
}

const initialPurchaseState = {
  unpaid_purchase: null,
  paid_purchases: [],
  done_purchases: [],
  swish_request_token: null,
  error: '',
}

function purchase(state = initialPurchaseState, action) {
  switch(action.type) {
  case POST_PURCHASE_SUCCESS: {
    return {...state, unpaid_purchase: action.purchase}
  }
  case POST_PURCHASE_FAILURE:
    return {...state, error: action.error}
  case START_PAY_SWISH_SUCCESS:
    return {...state, swish_request_token: action.requestToken}
  case START_PAY_SWISH_FAILURE:
    return {...state, error: action.error}
  default:
    return state
  }
}

export const reducers = {
  store,
  purchase,
}
