import React from 'react'
import { FlatList } from 'react-native'
import { Card, Title, Paragraph } from 'react-native-paper'
import { connect } from 'react-redux'

class CompletedOrderScreen extends React.Component {

  renderItem(item) {
    return (
      <Card style={{margin:5, marginBottom:1,}}>
        <Card.Content>
          <Title>Order: {item.id}</Title>
          <Paragraph>{item.purchaseMessage}</Paragraph>
        </Card.Content>
      </Card>
    )
  }

  render() {
    return (
      <FlatList
        data={this.props.completed}
        renderItem={({item}) => this.renderItem(item)}
        keyExtractor={(item, index) => String(item.id)}
      />
    )
  }
}

const mapStateToProps = state => ({
  completed: state.websocket.completed_purchases,
})

export default connect(mapStateToProps)(CompletedOrderScreen)
