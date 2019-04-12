// In App.js in a new project

import React from 'react'
import { createStackNavigator, createAppContainer} from 'react-navigation'
import { Provider as PaperProvider } from 'react-native-paper'
import HomeScreen from './screens/HomeScreen'
import DetailsScreen from './screens/DetailsScreen'

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
  render(){
    return (
      <PaperProvider>
        <AppContainer />
      </PaperProvider>
    )

  }
}
