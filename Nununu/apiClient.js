import axios from 'axios'
import constants from './constants'

export const apiClient = axios.create({
  baseURL: constants.EmulatorUrl,
})
