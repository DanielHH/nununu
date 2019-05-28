import axios from 'axios'
import constants from './constants'

export const apiClient = axios.create({
  baseURL: 'http' + (constants.TRANSPORT_LAYER_SECURITY ? 's' : '') + '://' + constants.SERVER_ADDRESS,
})
