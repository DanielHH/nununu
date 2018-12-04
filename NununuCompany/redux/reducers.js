import {
  COMPLETE_ORDER,
} from './actions'

const initialOrderState = {
  active: [],
  completed: [],
}

function order(state = initialOrderState, action) {
  switch (action.type) {
  case COMPLETE_ORDER:
    return {...state, completed: [...state.completed, action.order]}
  default:
    return state
  }
}

export const reducers = {
  order,
}
