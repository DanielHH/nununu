import React, {Component} from 'react';
import {View, Text} from 'react-native';
import { createDrawerNavigator, createMaterialTopTabNavigator } from 'react-navigation';
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

const Drawer = createDrawerNavigator({
  Order: {
    screen: OrderTabNav,
    navigationOptions: {
      drawerLabel: "Ordrar",
    },
  },
  EditMenu: {
    screen: EditMenuScreen,
  },
});

export default Drawer
