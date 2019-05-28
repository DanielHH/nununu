import {
  COMPLETE_PURCHASE_SUCCESS, COMPLETE_PURCHASE_FAILURE, SET_ACTIVE_ORDERS, SET_COMPLETED_ORDERS,
  SIGN_IN_USER_SUCCESS, SIGN_IN_USER_FAILURE, REMOVE_TOKEN, 
  SIGN_UP_USER_SUCCESS, SIGN_UP_USER_FAILURE, START_NEW_SIGNUP,
  ADD_PRODUCT_SUCCESS, ADD_PRODUCT_FAILURE, REMOVE_PRODUCT, 
  EDIT_PRODUCT_SUCCESS, EDIT_PRODUCT_FAILURE, CHANGE_PRODUCT_ORDER, 
  ADD_CATEGORY_SUCCESS, ADD_CATEGORY_FAILURE, GET_COMPANY_PRODUCTS_SUCCESS, 
  GET_COMPANY_PRODUCTS_FAILURE, CREATE_COMPANY_SUCCESS, CREATE_COMPANY_FAILURE, 
  REMOVE_MENU, GO_TO_CATEGORY, START_EDIT_PRODUCT, START_ADD_PRODUCT, 
  REORDER_PRODUCTS_SUCCESS, REORDER_PRODUCTS_FAILURE, 
  REORDER_CATEGORIES_SUCCESS, REORDER_CATEGORIES_FAILURE, RESET_PASSWORD_EMAIL_SENT,
  RESET_PASSWORD_EMAIL_FAILURE, START_RECOVER_PASSWORD} from './actions'
import produce from 'immer'


const initialAuthState = {
  token: null,
  signUpUserSuccess: false,
  showSuccessfulSignUp: false,
  resetPasswordEmailSent: false,
  error: {},
}

function authentication(state = initialAuthState, action) {
  switch (action.type) {
  case SIGN_IN_USER_SUCCESS:
    return {...state, token: action.token, showSuccessfulSignUp: false, resetPasswordEmailSent: false}
  case SIGN_IN_USER_FAILURE:
    return {...state, error: action.error}
  case REMOVE_TOKEN:
    return {...state, token: null}
  case SIGN_UP_USER_SUCCESS:
    return {...state, signUpUserSuccess: action.signUpUserSuccess, error: {}}
  case SIGN_UP_USER_FAILURE:
    return {...state, error: {signUpError: action.error}}
  case START_NEW_SIGNUP:
    return {...state, showSuccessfulSignUp: false, error: {}}
  case CREATE_COMPANY_SUCCESS:
    return {...state, showSuccessfulSignUp: action.showSuccessfulSignUp, error: {}}
  case CREATE_COMPANY_FAILURE:
    return {...state, error: {createCompanyError: action.error}}
  case RESET_PASSWORD_EMAIL_SENT:
    return {...state, resetPasswordEmailSent: true}
  case RESET_PASSWORD_EMAIL_FAILURE:
    return {...state, error: {resetPasswordError: action.error}}
  case START_RECOVER_PASSWORD:
    return {...state, resetPasswordEmailSent: false, error: {}}
  default:
    return state
  }
}

const initialMenuState = {
  categories: {
  },
  categoriesOrder: [],
  currentCategoryId: '',
  productToEdit: null,
  error: {},
}

function menu(state = initialMenuState, action) {
  switch (action.type) {
  case REMOVE_MENU:
    return produce(state, draft => {
      draft.categories = {}
      draft.categoriesOrder = []
      draft.currentCategoryId = ''
      draft.error = {}
    })
  case GET_COMPANY_PRODUCTS_SUCCESS:
    return produce(state, draft => {
      var categoryObj
      for (let i = 0; i < action.categories.length; i++) {
        categoryObj = action.categories.find(category => category.position == i)
        draft.categoriesOrder.push(categoryObj)
        draft.categories[categoryObj.id] = []
      }
      var productObj
      for (let j=0; j < draft.categoriesOrder.length; j++) {
        for (let k = 0; k < action.products.length; k++) { // TODO: This loop could be done more effectively, by specifying how many products there are of a certain category
          productObj = action.products.find(product => ((product.position == k) && (product.categoryId == draft.categoriesOrder[j].id)))
          if (productObj) {
            draft.categories[draft.categoriesOrder[j].id].push(productObj)
          }
        }
      }
    })
  case GET_COMPANY_PRODUCTS_FAILURE: 
    return produce(state, draft => {
      draft.error = action.error
    })
  case REORDER_CATEGORIES_SUCCESS:
    return produce(state, draft => {
      draft.categoriesOrder = action.reorderedCategories
    })
  case REORDER_CATEGORIES_FAILURE:
    return produce(state, draft => {
      draft.error = action.error
    })
  case ADD_CATEGORY_SUCCESS:
    var categoryObj = action.category
    return produce(state, draft => {
      draft.categoriesOrder.push(categoryObj)
      draft.categories[categoryObj.id] = []
    })
  case ADD_CATEGORY_FAILURE:
    return produce(state, draft => {
      draft.error = action.error
    })
  case GO_TO_CATEGORY:
    return produce(state, draft => {
      draft.currentCategoryId = action.categoryId
    })
  case REORDER_PRODUCTS_SUCCESS:
    return produce(state, draft => {
      draft.categories[action.categoryId] = action.reorderedProducts
    })
  case REORDER_PRODUCTS_FAILURE:
    return produce(state, draft => {
      draft.error = action.error
    })
  case START_EDIT_PRODUCT:
    return produce(state, draft => {
      draft.productToEdit = action.product
    })
  case START_ADD_PRODUCT:
    return produce(state, draft => {
      draft.productToEdit = null
    })
  case EDIT_PRODUCT_SUCCESS:
    return produce(state, draft => {
      let index = draft.categories[action.categoryId].findIndex(product => product.id == action.id)
      draft.categories[action.categoryId][index] = action.editedProduct
    })
  case EDIT_PRODUCT_FAILURE:
    return produce(state, draft => {
      draft.error = action.error
    })
  case ADD_PRODUCT_SUCCESS:
    return produce(state, draft => {
      draft.categories[action.categoryId].push(action.newProduct)
    })
  case ADD_PRODUCT_FAILURE:
    return produce(state, draft => {
      draft.error = action.error
    })
  case REMOVE_PRODUCT:
    return produce(state, draft => {
      draft.splice(draft.findIndex(product => product.id === action.id), 1) // Old code. This will probably not work.
    })
  case CHANGE_PRODUCT_ORDER:
    return
  default:
    return state
  }
}

const initialPurchaseState = {
  open: false,
  active_purchases: [],
  completed_purchases: [],
}

function purchase(state = initialPurchaseState, action) {
  switch (action.type) {
  case 'REDUX_WEBSOCKET::OPEN': {
    return {...state, open: action.meta.timestamp}
  }
  case 'REDUX_WEBSOCKET::MESSAGE': {
    let message = JSON.parse(action.payload.message)
    switch (message.type) {
    case 'connect':
      if (message.status === 200) {
        return {...state, active_purchases: message.active_purchases,
          completed_purchases: message.completed_purchases}
      }
      else {
        // invalid, logout
        break
      }
    case 'new_purchase': {
      let new_active_purchases = [...state.active_purchases]
      new_active_purchases.push(message.purchase)
      return {...state, active_purchases: new_active_purchases}
    }
    default:
      break
    }
    break
  }
  case COMPLETE_PURCHASE_SUCCESS: {
    let new_active = [...state.active_purchases] // clone data
    let new_completed = [...state.completed_purchases]
    for (var i = 0; i < new_active.length; i++) {
      if (new_active[i].id === action.purchase.id) {
        new_completed.unshift(action.purchase) // add purchase to beginning of completed
        new_active.splice(i, 1) // remove purchase from active
      }
    }
    return {...state, active_purchases: new_active, completed_purchases: new_completed}
  }
  case COMPLETE_PURCHASE_FAILURE:
    return {...state, error: action.error}
  default:
    return state
  }
}

export const reducers = {
  authentication,
  menu,
  purchase,
}
