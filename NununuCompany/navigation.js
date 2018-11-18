import React from 'react'
import {View, Text} from 'react-native'
import { createDrawerNavigator, createMaterialTopTabNavigator, createStackNavigator } from 'react-navigation'
import ActiveOrderScreen from './screens/ActiveOrderScreen'
import CompletedOrderScreen from './screens/CompletedOrderScreen'
import EditMenuScreen from './screens/EditMenuScreen'
import ArticleScreen from './screens/ArticleScreen'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

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
        <Icon name="menu" size={24} onPress = {() => navigation.toggleDrawer()}/>
      ),
    }),
  },
})

const EditMenuStackNav = createStackNavigator({
  EditMenu: {
    screen: EditMenuScreen,
    navigationOptions: ({ navigation }) => ({
      headerTitle: 'Redigera meny',
      headerLeft: (
        <Icon name="menu" size={24} onPress = {() => navigation.toggleDrawer()}/>
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

const Drawer = createDrawerNavigator({
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
})

export default Drawer
