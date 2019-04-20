import { createStore, applyMiddleware } from 'redux'
import { persistStore, persistCombineReducers } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web and AsyncStorage for react-native
import { reducers } from './redux/reducers'
import thunk from 'redux-thunk'

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['products'], // only products will be persisted
}

const persistedReducer = persistCombineReducers(persistConfig, reducers)

export default function createPersistStore () {
  let store = createStore(
    persistedReducer,
    applyMiddleware(thunk)
  )
  // subscribe to store for debbuging, logs all the changes
  // note that logging all the changes is performance demanding

  store.subscribe(() => {
    console.log(store.getState())
  })

  let persistor = persistStore(store)
  return { store, persistor }
}
