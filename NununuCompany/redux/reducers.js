import { COMPLETE_ORDER, SET_ACTIVE_ORDERS, SET_COMPLETED_ORDERS } from './actions'



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

export const reducers = {
  order,
}
