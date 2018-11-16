import React, {Component} from 'react';
import {View, Text} from 'react-native';
import { createDrawerNavigator } from 'react-navigation';

export default class OrderScreen extends React.Component {
  static navigationOptions = {
    drawerLabel: 'Ordrar',
  };

  render() {
    return (
      <View>
        <Text>
          Ordrar
        </Text>
      </View>
    );
  }
}
