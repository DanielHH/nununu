import { createStore, applyMiddleware  } from 'redux'
import { persistStore, persistCombineReducers } from 'redux-persist'
import thunk from 'redux-thunk'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web and AsyncStorage for react-native
import { reducers } from './redux/reducers'

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['order', 'authentication'], // only order will be persisted
}

const persistedReducer = persistCombineReducers(persistConfig, reducers)

export default function testExport () {
  let store = createStore(persistedReducer, applyMiddleware(thunk))
  // subscribe to store for debbuging, logs all the changes
  // note that logging all the changes is performance demanding

  /*store.subscribe(() => {
    console.log(store.getState())
  })*/

  let persistor = persistStore(store)
  return { store, persistor }
}
