/** @format */

import {AppRegistry} from 'react-native'
import App from './App'
import {name as appName} from './app.json'
import ForgotPswScreen from './screens/ForgotPswScreen'
import RegisterUserScreen from './screens/RegisterUserScreen'

AppRegistry.registerComponent(appName, () => RegisterUserScreen)
