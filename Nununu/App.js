import React from 'react'
import { View, StatusBar, Platform } from 'react-native'
import { Provider as PaperProvider } from 'react-native-paper'
import { AppLoading, Asset, Font, Icon, Linking, Notifications } from 'expo'
import { PersistGate } from 'redux-persist/integration/react'
import createPersistStore from './configureStore'
import { Provider } from 'react-redux'
import DropdownAlert from 'react-native-dropdownalert'
import DropDownHolder from './components/DropDownHolder'
import { makePurchaseCompleted } from './redux/actions'
import Main from './components/Main'

export default class App extends React.Component {
  state = {
    isLoadingComplete: false,
  }

  constructor(props) {
    super(props)
    this.conf = createPersistStore()
  }

  componentDidMount() {
    // Handle notifications that are received or selected while the app
    // is open. If the app was closed and then opened by tapping the
    // notification (rather than just tapping the app icon to open it),
    // this function will fire on the next tick after the app starts
    // with the notification data.
    this._notificationSubscription = Notifications.addListener(this._handleNotification)
    if (Platform.OS === 'android') {
      Notifications.createChannelAndroidAsync('purchase', {
        name: 'Purchase',
        sound: true,
        priority: 'max',
        vibrate: [0, 250, 250, 250],
      })
    }
  }

  _handleNotification = (notification) => {
    if (notification.data.type === 'purchase_completed') {
      if (notification.origin === 'received') {
        // change purchase to completed
        this.conf.store.dispatch(makePurchaseCompleted(parseInt(notification.data.purchaseId)))
      }
      else if (notification.origin === 'selected') {
      // push notification selected, display purchase
        let url = Linking.makeUrl('details', {purchaseId: notification.data.purchaseId})
        Linking.openURL(url)
      }
    }
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
              <Main />
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
