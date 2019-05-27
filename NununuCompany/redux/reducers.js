import { COMPLETE_PURCHASE_SUCCESS, COMPLETE_PURCHASE_FAILURE,
  SIGN_IN_USER_SUCCESS, SIGN_IN_USER_FAILURE, REMOVE_TOKEN
  , SIGN_UP_USER_SUCCESS, SIGN_UP_USER_FAILURE, START_NEW_SIGNUP} from './actions'


const initialAuthState = {
  token: null,
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
    return {...state, showSuccessfulSignUp: action.showSuccessfulSignUp, error: {}}
  case SIGN_UP_USER_FAILURE:
    return {...state, error: {signUpError: action.error}}
  case START_NEW_SIGNUP:
    return {...state, showSuccessfulSignUp: false, error: {}}
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
  websocket,
}
