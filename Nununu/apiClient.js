import axios from 'axios'
import constants from './constants'

export const apiClient = axios.create({
  baseURL: 'http://' + constants.SERVER_ADDRESS,
})
