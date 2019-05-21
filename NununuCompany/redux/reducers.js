import { COMPLETE_ORDER, SET_ACTIVE_ORDERS, SET_COMPLETED_ORDERS,
  SIGN_IN_USER_SUCCESS, SIGN_IN_USER_FAILURE, REMOVE_TOKEN
  , SIGN_UP_USER_SUCCESS, SIGN_UP_USER_FAILURE, START_NEW_SIGNUP} from './actions'


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

const initialWsState = {
  open: false,
}

function websocket(state = initialWsState, action) {
  switch (action.type) {
  case 'REDUX_WEBSOCKET::OPEN': {
    return {...state, open: action.meta.timestamp}
  }
  default:
    return state
  }
}

export const reducers = {
  order,
  authentication,
  websocket,
}
