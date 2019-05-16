import React, {Component} from 'react'
import { View } from 'react-native'
import { PersistGate } from 'redux-persist/integration/react'
import testExport from './configureStore'
import { Provider } from 'react-redux'
import Main from './components/Main'

type Props = {};

export default class App extends Component<Props> {

  constructor(props) {
    super(props)
    this.conf = testExport()
    console.disableYellowBox = true // DISABLES YELLOW WARNING BOX
  }

  render() {
    return (
      <Provider store={this.conf.store}>
        <PersistGate loading={null} persistor={this.conf.persistor}>
          <View style={{flex: 1}}>
            <Main/>
          </View>
        </PersistGate>
      </Provider>
    )
  }
}
