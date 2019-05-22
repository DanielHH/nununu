import { COMPLETE_ORDER, SET_ACTIVE_ORDERS, SET_COMPLETED_ORDERS,
  SIGN_IN_USER_SUCCESS, SIGN_IN_USER_FAILURE, REMOVE_TOKEN
  , SIGN_UP_USER_SUCCESS, SIGN_UP_USER_FAILURE, START_NEW_SIGNUP,
  ADD_PRODUCT_SUCCESS, ADD_PRODUCT_FAILURE, REMOVE_PRODUCT, 
  EDIT_PRODUCT_SUCCESS, EDIT_PRODUCT_FAILURE, CHANGE_PRODUCT_ORDER, 
  ADD_CATEGORY_SUCCESS, ADD_CATEGORY_FAILURE, GET_COMPANY_PRODUCTS_SUCCESS, 
  GET_COMPANY_PRODUCTS_FAILURE, CREATE_COMPANY_SUCCESS, CREATE_COMPANY_FAILURE, 
  REMOVE_MENU, GO_TO_CATEGORY, START_EDIT_PRODUCT, START_ADD_PRODUCT, 
  REORDER_PRODUCTS_SUCCESS, REORDER_PRODUCTS_FAILURE, 
  REORDER_CATEGORIES_SUCCESS, REORDER_CATEGORIES_FAILURE} from './actions'
import parseErrorStack from 'react-native/Libraries/Core/Devtools/parseErrorStack'
import produce from 'immer'


const initialOrderState = {
  active: [],
  completed: [],
}

function order(state = initialOrderState, action) {
  switch (action.type) {
  case SET_ACTIVE_ORDERS:
    return {...state, active: action.orders}
  case SET_COMPLETED_ORDERS:
    return {...state, completed: action.orders}
  case COMPLETE_ORDER: {
    let new_active = [...state.active] // clone data
    let new_completed = [...state.completed]
    for (var i = 0; i < new_active.length; i++) {
      if (new_active[i].id === action.orderId) {
        new_completed.unshift(new_active[i]) // add order to beginning of completed
        new_active.splice(i, 1) // remove order from active
      }
    }
    return {...state, active: new_active, completed: new_completed}
  }
  default:
    return state
  }
}


const initialAuthState = {
  token: null,
  signUpUserSuccess: false,
  showSuccessfulSignUp: false,
  error: {},
}

function authentication(state = initialAuthState, action) {
  switch (action.type) {
  case SIGN_IN_USER_SUCCESS:
    return {...state, token: action.token, showSuccessfulSignUp: action.showSuccessfulSignUp}
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
      var i
      var categoryObj
      for (i = 0; i < action.categories.length; i++) {
        categoryObj = action.categories.find(category => category.position == i)
        draft.categoriesOrder.push(categoryObj)
        draft.categories[categoryObj.id] = []
      }
      var productObj
      var j
      var k
      for (j=0; j < draft.categoriesOrder.length; j++) {
        for (k = 0; k < action.products.length; k++) { // TODO: This loop could be done more effectively, by specifying how many products there are of a certain category
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
      draft.splice(draft.findIndex(product => product.id === action.id), 1)
    })
  case CHANGE_PRODUCT_ORDER:
    return
  default:
    return state
  }
}

export const reducers = {
  order,
  authentication,
  menu,
}
