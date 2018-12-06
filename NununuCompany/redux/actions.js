/*
 * action types
 */

export const SET_ACTIVE = 'SET_ACTIVE'

export const COMPLETE_ORDER = 'COMPLETE_ORDER'

/*
 * other constants
 */


/*
 * action creators
 */

export function setActive(orders) {
  return { type: SET_ACTIVE, orders}
}

export function completeOrder(order) {
  return { type: COMPLETE_ORDER, order}
}
