import React from 'react'
import {View, Text, FlatList, TouchableOpacity} from 'react-native'

export default class ActiveOrderScreen extends React.Component {

state = {
  data: [...Array(8)].map((d, index) => ({
    key: `item-${index}`,
    orderNumber: '#' + String(index + 1),
    content: String(index + 1) + ' st Hamburgare, ' + String(Math.max(index-14, 1)) + 'st Coca-cola',
    backgroundColor: `rgb(${(index % 2)*70}, ${100}, ${132})`,
  })),
}

renderItem = ({ item, index, isActive }) => {
  return (
    <TouchableOpacity
      style={{
        height: 100,
        backgroundColor: isActive ? 'blue' : item.backgroundColor,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
      }}
    >
    <Text style={{
      fontWeight: 'bold',
      color: 'black',
      fontSize: 32,
      backgroundColor: 'yellow',
    }}>
      {item.orderNumber}
    </Text>

      <Text style={{
        fontWeight: 'bold',
        color: 'white',
        fontSize: 32,
      }}>
        {item.content}
      </Text>
    </TouchableOpacity>
  )
}

  render() {
    return (
      <View style={{flex: 1 }}>
      <FlatList
        data={this.state.data}
        extraData={this.state}
        renderItem={this.renderItem}
        scrollPercent={5}
        onMoveEnd={({ data }) => this.setState({ data })}
        />
      </View>
    )
  }
}
