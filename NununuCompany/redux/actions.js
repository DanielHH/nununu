import { AsyncStorage } from 'react-native'
/*
 * action types
 */

export const SET_ACTIVE_ORDERS = 'SET_ACTIVE_ORDERS'

export const SET_COMPLETED_ORDERS = 'SET_COMPLETED_ORDERS'

export const COMPLETE_ORDER = 'COMPLETE_ORDER'

export const SAVE_TOKEN = 'SAVE_TOKEN'

export const REMOVE_TOKEN = 'REMOVE_TOKEN'

/*
 * other constants
 */


/*
 * action creators
 */

export function setActiveOrders(orders) {
  return { type: SET_ACTIVE_ORDERS, orders}
}

export function setCompletedOrders(orders) {
  return { type: SET_COMPLETED_ORDERS, orders}
}

export function completeOrder(orderId) {
  return { type: COMPLETE_ORDER, orderId}
}

export function saveToken(token) {
  return { type: SAVE_TOKEN, token }
}

export function removeToken() {
  return { type: REMOVE_TOKEN }
}
