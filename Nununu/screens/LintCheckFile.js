// In App.js in a new project

import React from 'react'
import { View, Text } from 'react-native'
import { createStackNavigator, createAppContainer} from 'react-navigation'
import HomeScreen from './screens/HomeScreen'
import DetailsScreen from './screens/DetailsScreen'

const AppNavigator = createStackNavigator({
  Home: {
    screen: HomeScreen,
  },
})

const AppContainer = createAppContainer(AppNavigator)

export default class App extends React.Component {
  render(){
    return<AppContainer />
  }
}

const RootStack = createStackNavigator(
  {
    Home: HomeScreen,
    Details: DetailsScreen,
  },
  {
    initialRouteName: 'Home'
  }
)
