import { createStore, applyMiddleware } from 'redux'
import { persistStore, persistCombineReducers } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web and AsyncStorage for react-native
import { reducers } from './redux/reducers'
import thunk from 'redux-thunk'
import reduxWebsocket from '@giantmachines/redux-websocket'

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['purchase'], // only these will be persisted
}

const persistedReducer = persistCombineReducers(persistConfig, reducers)

const reduxWebsocketMiddleware = reduxWebsocket()

export default function createPersistStore () {
  let store = createStore(
    persistedReducer,
    applyMiddleware(thunk, reduxWebsocketMiddleware)
  )
  // subscribe to store for debbuging, logs all the changes
  // note that logging all the changes is performance demanding
  /*
  store.subscribe(() => {
    console.log(store.getState())
  })
  */
  let persistor = persistStore(store)
  return { store, persistor }
}
