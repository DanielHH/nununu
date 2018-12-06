import { COMPLETE_ORDER, SET_ACTIVE } from './actions'



const initialOrderState = {
  active: [],
  completed: [],
}

function order(state = initialOrderState, action) {
  switch (action.type) {
  case SET_ACTIVE:
    return {...state, active: [...state.active, action.orders]}
  case COMPLETE_ORDER:
    return {...state,
      completed: [
        ...state.completed, action.order
      ],
      active: [
        ...state.active.slice(0, action.order),
        ...state.active.slice(action.order + 1)
      ]}
  default:
    return state
  }
}

export const reducers = {
  order,
}
