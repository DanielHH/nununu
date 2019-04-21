// In App.js in a new project

import React from 'react'
import { View, StatusBar } from 'react-native'
import { createStackNavigator, createAppContainer} from 'react-navigation'
import { Provider as PaperProvider } from 'react-native-paper'
import HomeScreen from './screens/HomeScreen'
import DetailsScreen from './screens/DetailsScreen'
import { AppLoading, Asset, Font, Icon } from 'expo'
import { PersistGate } from 'redux-persist/integration/react'
import createPersistStore from './configureStore'
import { Provider } from 'react-redux'
import DropdownAlert from 'react-native-dropdownalert'
import DropDownHolder from './components/DropDownHolder'

const RootStack = createStackNavigator(
  {
    Home: HomeScreen,
    Details: DetailsScreen,
  },
  {
    initialRouteName: 'Home',
  }
)

const AppContainer = createAppContainer(RootStack)

export default class App extends React.Component {
  state = {
    isLoadingComplete: false,
  }

  constructor(props) {
    super(props)
    this.conf = createPersistStore()
  }

  render(){
    if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
      return (
        <AppLoading
          startAsync={this._loadResourcesAsync}
          onError={this._handleLoadingError}
          onFinish={this._handleFinishLoading}
        />
      )
    }
    return (
      <View style={{flex: 1}}>
        <Provider store={this.conf.store}>
          <PersistGate loading={null} persistor={this.conf.persistor}>
            <PaperProvider>
              <AppContainer />
            </PaperProvider>
          </PersistGate>
        </Provider>
        <DropdownAlert ref={(ref) => DropDownHolder.setDropDown(ref)}
          defaultContainer={{ padding: 8, paddingTop: StatusBar.currentHeight, flexDirection: 'row' }}/>
      </View>
    )
  }

  _loadResourcesAsync = async () => {
    return Promise.all([
      Asset.loadAsync([
        //
      ]),
      Font.loadAsync({
        // This is the font that we are using for our tab bar
        ...Icon.Ionicons.font,
        'MaterialIcons': require('@expo/vector-icons/fonts/MaterialIcons.ttf'),
        // We include SpaceMono because we use it in HomeScreen.js. Feel free
        // to remove this if you are not using it in your app
        'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
      }),
    ])
  }

  _handleLoadingError = error => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.warn(error)
  }

  _handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true })
  }
}
