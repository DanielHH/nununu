import { GET_COMPANIES_SUCCESS, GET_COMPANIES_FAILURE, SET_SELECTED_COMPANY,
  GET_COMPANY_PRODUCTS_SUCCESS, GET_COMPANY_PRODUCTS_FAILURE, INCREASE_PRODUCT_QUANTITY,
  DECREASE_PRODUCT_QUANTITY, POST_PURCHASE_SUCCESS, POST_PURCHASE_FAILURE,
  START_PAY_SWISH_SUCCESS, START_PAY_SWISH_FAILURE, PAYED_PURCHASE, SET_SELECTED_PURCHASE } from './actions'

const initialStoreState = {
  companies: [],
  selectedCompany: null,
  sections: [],
  error: '',
}

function store(state = initialStoreState, action) {
  switch (action.type) {
  case GET_COMPANIES_SUCCESS:
    return {...state, companies: action.data}
  case GET_COMPANIES_FAILURE:
    return {...state, companies: action.error}
  case SET_SELECTED_COMPANY:
    return {...state, selectedCompany: action.company}
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
      if (new_sections[i].title == action.sectionTitle) {
        new_sections[i].data[action.index].quantity += 1
      }
    }
    return {...state, sections: new_sections}
  }
  case DECREASE_PRODUCT_QUANTITY: {
    let new_sections = [...state.sections] // clone data
    for (let i = 0; i<new_sections.length; i++) {
      if (new_sections[i].title == action.sectionTitle) {
        if (new_sections[i].data[action.index].quantity > 0) {
          new_sections[i].data[action.index].quantity -= 1
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
  purchases: [],
  selected_purchase: null,
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
  case PAYED_PURCHASE: {
    let new_purchases = [...state.purchases]
    // add payed purchase to start of purchases
    new_purchases.unshift(action.purchase)
    return {...state, purchases: new_purchases, unpaid_purchase: null, paid_purchase: action.purchase}
  }
  case SET_SELECTED_PURCHASE:
    return {...state, selected_purchase: action.purchase}
  default:
    return state
  }
}

export const reducers = {
  store,
  purchase,
}
