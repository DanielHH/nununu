import React, {Component} from 'react'
import {View} from 'react-native'
import Navigation from './navigation'
import { PersistGate } from 'redux-persist/integration/react'
import testExport from './configureStore'
import { Provider } from 'react-redux'

type Props = {};

export default class App extends Component<Props> {
  constructor (props) {
    super(props)
    this.conf = testExport()
  }
  render() {
    return (
      <Provider store={this.conf.store}>
        <PersistGate loading={null} persistor={this.conf.persistor}>
          <View style={{flex: 1}}>
            <Navigation/>
          </View>
        </PersistGate>
      </Provider>
    )
  }
}
