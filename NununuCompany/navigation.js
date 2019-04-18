import React, { Component } from 'react'
import {
  View,
  Text,
  ActivityIndicator,
  AsyncStorage,
  StatusBar,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Button,
} from 'react-native'
import {
  createDrawerNavigator,
  createMaterialTopTabNavigator,
  createStackNavigator,
  createSwitchNavigator,
  createAppContainer,
  DrawerItems} from 'react-navigation'
import ActiveOrderScreen from './screens/ActiveOrderScreen'
import CompletedOrderScreen from './screens/CompletedOrderScreen'
import EditMenuScreen from './screens/EditMenuScreen'
import ArticleScreen from './screens/ArticleScreen'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import LogInScreen from './screens/LogInScreen'
import AuthLoadingScreen from './screens/AuthLoadingScreen'

import { removeToken } from './redux/actions'
import { connect } from 'react-redux'
import CustomContentComponent from './drawerMenu'

const OrderTabNav = createMaterialTopTabNavigator({
  Active: {
    screen: ActiveOrderScreen,
    navigationOptions: {
      tabBarLabel: ({ tintColor, focused }) => (
        <View>
          <Text style={{color: tintColor, fontSize: 12}}>
            Aktiva
          </Text>
        </View>
      ),
    },
  },
  Completed: {
    screen: CompletedOrderScreen,
    navigationOptions: {
      tabBarLabel: ({ tintColor, focused }) => (
        <View>
          <Text style={{color: tintColor, fontSize: 12}}>
            Färdiga
          </Text>
        </View>
      ),
    },
  },
}, {
  initialRouteName: 'Active',
  swipeEnabled: false,
})

const OrderStackNav = createStackNavigator({
  OrderTab: {
    screen: OrderTabNav,
    navigationOptions: ({ navigation }) => ({
      headerTitle: 'Ordrar',
      headerLeft: (
        <MaterialCommunityIcons name="menu" size={24} onPress = {() => navigation.toggleDrawer()}/>
      ),
    }),
  },
})

export const EditMenuStackNav = createStackNavigator({
  EditMenu: {
    screen: EditMenuScreen,
    navigationOptions: ({ navigation }) => ({
      headerTitle: 'Redigera meny',
      headerLeft: (
        <MaterialCommunityIcons name="menu" size={24} onPress = {() => navigation.toggleDrawer()}/>
      ),
    }),
  },
  EditArticle: {
    screen: ArticleScreen,
    navigationOptions: ({ navigation }) => ({
      headerTitle: 'Redigera artikel',
    }),
  },
  AddArticle: {
    screen: ArticleScreen,
    navigationOptions: ({ navigation }) => ({
      headerTitle: 'Lägg till artikel',
    }),
  },
})

let Drawer = createAppContainer(createDrawerNavigator({
  OrderStack: {
    screen: OrderStackNav,
    navigationOptions: {
      drawerLabel: 'Ordrar',
    },
  },
  EditMenu: {
    screen: EditMenuStackNav,
    navigationOptions: {
      drawerLabel: 'Redigera meny',
    },
  },

}, {
  drawerWidth: 300,
  contentComponent: (props) => <CustomContentComponent {...props} />
}))


const mapDispatchToProps = dispatch => ({
  removeUserToken: () => dispatch(removeToken())
})

export default connect(null, mapDispatchToProps)(Drawer)
