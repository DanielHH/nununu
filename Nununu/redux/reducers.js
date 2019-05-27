import { GET_COMPANIES_SUCCESS, GET_COMPANIES_FAILURE, SET_SELECTED_COMPANY,
  GET_COMPANY_PRODUCTS_SUCCESS, GET_COMPANY_PRODUCTS_FAILURE, INCREASE_PRODUCT_QUANTITY,
  DECREASE_PRODUCT_QUANTITY, POST_PURCHASE_SUCCESS, POST_PURCHASE_FAILURE,
  START_PAY_SWISH_SUCCESS, START_PAY_SWISH_FAILURE, MAKE_PURCHASE_COMPLETED,
  SET_PURCHASER_ID } from './actions'
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
    return {...state, error: action.error}
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
  ws_open: false,
  ws_connected: false,
  unpaid_purchase: null,
  paid_purchase_id: null,
  purchases: [],
  swish_request_token: null,
  error: '',
  purchaser_id: null,
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
  case MAKE_PURCHASE_COMPLETED: {
    let new_purchases = [...state.purchases]
    for (let i = 0; i < new_purchases.length; i++) {
      if (new_purchases[i].id === action.purchaseId) {
        new_purchases[i].completed = true
        break
      }
    }
    return {...state, purchases: new_purchases}
  }
  case SET_PURCHASER_ID:
    return {...state, purchaser_id: action.purchaserId}
  case 'REDUX_WEBSOCKET::OPEN': {
    return {...state, ws_open: action.meta.timestamp}
  }
  case 'REDUX_WEBSOCKET::MESSAGE': {
    let message = JSON.parse(action.payload.message)
    switch (message.type) {
    case 'connect':
      if (message.status === 200) {
        return {...state, ws_connected: true}
      }
      else {
        // invalid, not connected
        break
      }
    case 'purchase_paid': {
      let new_purchases = [...state.purchases]
      // add payed purchase to start of purchases
      let new_paid_purchase_id = state.paid_purchase_id
      if (message['purchase_id'] === state.unpaid_purchase.id) {
        new_purchases.unshift(state.unpaid_purchase)
        new_paid_purchase_id = message['purchase_id']
      }
      return {...state, purchases: new_purchases, unpaid_purchase: null, paid_purchase_id: new_paid_purchase_id}
    }
    default:
      break
    }
    break
  }
  case 'REDUX_WEBSOCKET::ERROR':
    return {...state, error: [action.meta, action.payload]}
  default:
    return state
  }
}

export const reducers = {
  store,
  purchase,
}
