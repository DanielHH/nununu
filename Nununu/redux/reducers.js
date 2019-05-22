import { GET_COMPANIES_SUCCESS, GET_COMPANIES_FAILURE, SET_SELECTED_COMPANY,
  GET_COMPANY_PRODUCTS_SUCCESS, GET_COMPANY_PRODUCTS_FAILURE, INCREASE_PRODUCT_QUANTITY,
  DECREASE_PRODUCT_QUANTITY, POST_PURCHASE_SUCCESS, POST_PURCHASE_FAILURE,
  START_PAY_SWISH_SUCCESS, START_PAY_SWISH_FAILURE } from './actions'
import produce from 'immer'

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
  case GET_COMPANY_PRODUCTS_SUCCESS:
    return produce(state, draft => {
      draft.sections = []
      let category
      let categoryObj
      let productObj
      for (let i = 0; i < action.categories.length; i++) {
        category = {'title': '', 'data': []}
        categoryObj = action.categories.find(category => category.position == i)
        category.title = categoryObj.name
        for (let k = 0; k < action.products.length; k++) { // TODO: This loop could be done more effectively, by specifying how many products there are of a certain category
          productObj = action.products.find(product => ((product.position == k) && (product.categoryId == categoryObj.id)))
          if (productObj) {
            productObj.quantity = 0
            category.data.push(productObj)
          }
        }
        draft.sections.push(category)
      }
    })
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
