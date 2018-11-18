import React, {Component} from 'react'
import {View} from 'react-native'
import Navigation from './navigation'

type Props = {};

export default class App extends Component<Props> {
  render() {
    return (
      <View style={{flex: 1}}>
        <Navigation/>
      </View>
    )
  }
}
