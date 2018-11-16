import React, {Component} from 'react';
import {View, Text} from 'react-native';
import { createDrawerNavigator } from 'react-navigation';

export default class EditMenuScreen extends React.Component {
  static navigationOptions = {
    drawerLabel: 'Redigera meny',
  };

  render() {
    return (
      <View>
        <Text>
          Redigera meny
        </Text>
      </View>
    );
  }
}
