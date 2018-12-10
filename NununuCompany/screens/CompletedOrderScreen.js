import React from 'react'
import {View, Text, FlatList} from 'react-native'
import { IconButton, Button, Card, Title, Paragraph} from 'react-native-paper'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { connect } from 'react-redux'
import { setCompletedOrders } from '../redux/actions'

class CompletedOrderScreen extends React.Component {

  constructor(props) {
    super(props)
    this.props.dispatch(setCompletedOrders([]))
  }

  renderItem(item) {
    return (
      <View style={{
        height: 100,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
      }}>
        <Text style={{
          fontWeight: 'bold',
          color: 'white',
          fontSize: 26,
        }}>
          {item.content}
        </Text>
        <Text style={{
          fontWeight: 'bold',
          color: 'black',
          backgroundColor: 'yellow',
          fontSize: 26,
        }}>
          {item.orderNumber}
        </Text>
      </View>
    )
  }

  render() {
    return (
      <FlatList
        data={this.props.completed}
        renderItem={({item}) => this.renderItem(item)}
        keyExtractor={(item, index) => item.id}
      />
    )
  }
}

export default connect((state) => {
  return {
    completed: state.order.completed,
  }
})(CompletedOrderScreen)
