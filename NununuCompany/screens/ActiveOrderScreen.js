import React, {Component} from 'react'
import {StyleSheet, View} from 'react-native'
import SwipeableList from '../components/SwipeableList'


export default class ActiveOrderScreen extends Component {

  constructor(props) {
    super(props)
  }

  render() {
    return (
      <View style={styles.container}>
        <SwipeableList style={styles.list}/>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  list: {
    flex: 1,
  },
})
