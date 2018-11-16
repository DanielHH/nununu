import React, {Component} from 'react';
import {View, Text} from 'react-native';
import { createDrawerNavigator } from 'react-navigation';
import OrderScreen from './screens/OrderScreen'
import EditMenuScreen from './screens/EditMenuScreen'

const Drawer = createDrawerNavigator({
  Order: {
    screen: OrderScreen,
  },
  EditMenu: {
    screen: EditMenuScreen,
  },
});

export default Drawer
