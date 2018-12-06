import io from 'socket.io-client'
import feathers from '@feathersjs/feathers'
import socketio from '@feathersjs/socketio-client'

class Connection {
  BASE_URL = 'http://192.168.1.3:3030' //'https://www.societygo.com'
  constructor() {
    this.store = null
  }

  setupConnection = () => {
    // Creates socket-client instance that automatically connects to the server.
    this.socket = io(this.BASE_URL, {
      transports: ['websocket'],
      forceNew: true,
    })
    this.client = feathers()
    this.client.configure(socketio(this.socket))
    this.productService = this.client.service('products')
  }

  setStore = (store) => {
    this.store = store
  }
}

export const connection = new Connection
