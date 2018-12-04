import { createStore } from 'redux'
import { persistStore, persistCombineReducers } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web and AsyncStorage for react-native

import { reducers } from './redux/reducers'

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['order'], // only order will be persisted
}

const persistedReducer = persistCombineReducers(persistConfig, reducers)

export default function testExport () {
  let store = createStore(persistedReducer)
  let persistor = persistStore(store)
  return { store, persistor }
}
