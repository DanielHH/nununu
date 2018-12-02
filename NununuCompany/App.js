import React, {Component} from 'react'
import {View} from 'react-native'
import Navigation from './navigation'
import { connection } from './feathersSetup'

type Props = {};

export default class App extends Component<Props> {

  constructor(props) {
    super(props)
    connection.setupConnection()
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <Navigation/>
      </View>
    )
  }
}
