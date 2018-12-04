import React, {Component} from 'react'
import {StyleSheet, View} from 'react-native'
import SwipeableList from '../components/SwipeableList'
import listData from '../components/ListData'
import { connect } from 'react-redux'

class ActiveOrderScreen2 extends Component {

  constructor(props) {
    super(props)
  }

  render() {
    return (
      <View style={styles.container}>
        <SwipeableList style={styles.list} data={this.props.active} />
      </View>
    )
  }
}

export default connect((state) => {
  return {
    active: state.order.active,
  }
})(ActiveOrderScreen2)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  list: {
    flex: 1,
  },
})
