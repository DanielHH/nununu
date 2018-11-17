import React, {Component} from 'react';
import {View, Text, Button} from 'react-native';
import { createDrawerNavigator, createMaterialTopTabNavigator, createStackNavigator } from 'react-navigation';
import ActiveOrderScreen from './screens/ActiveOrderScreen'
import CompletedOrderScreen from './screens/CompletedOrderScreen'
import EditMenuScreen from './screens/EditMenuScreen'

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
});

const OrderStackNav = createStackNavigator({
   OrderTab: {
     screen: OrderTabNav,
     navigationOptions: ({ navigation }) => ({
      headerTitle: "Ordrar",
      headerLeft: (
        <Button onPress = {() => navigation.toggleDrawer()} title="drawer"/>
      ),
    }),
  }
})

const EditMenuStackNav = createStackNavigator({
   OrderTab: {
     screen: EditMenuScreen,
     navigationOptions: ({ navigation }) => ({
      headerTitle: "Redigera meny",
      headerLeft: (
        <Button onPress = {() => navigation.toggleDrawer()} title="drawer"/>
      ),
    }),
  }
})

const Drawer = createDrawerNavigator({
  OrderStack: {
    screen: OrderStackNav,
    navigationOptions: {
      drawerLabel: "Ordrar",
    },
  },
  EditMenu: {
    screen: EditMenuStackNav,
    navigationOptions: {
      drawerLabel: "Redigera meny",
    },
  },
});

export default Drawer
