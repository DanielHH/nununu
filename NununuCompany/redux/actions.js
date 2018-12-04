/*
 * action types
 */

export const COMPLETE_ORDER = 'COMPLETE_ORDER'

/*
 * other constants
 */


/*
 * action creators
 */

export function completeOrder(order) {
  return { type: COMPLETE_ORDER, order}
}
