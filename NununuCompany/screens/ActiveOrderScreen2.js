import React, {Component} from 'react'
import {StyleSheet, View} from 'react-native'
import SwipeableList from '../components/SwipeableList'
import listData from '../components/ListData'

export default class ActiveOrderScreen2 extends Component {
  render() {
    return (
      <View style={styles.container}>
        <SwipeableList style={styles.list} data={listData} />
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
    marginTop: 32,
  },
})
