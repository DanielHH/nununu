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
      <Card style={{margin:5, marginBottom:1,}}>
        <Card.Content>
          <Title>Order: {item.orderNumber}</Title>
          <Paragraph>{item.content}</Paragraph>
        </Card.Content>
      </Card>
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
