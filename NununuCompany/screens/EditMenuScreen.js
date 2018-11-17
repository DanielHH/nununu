import React, {Component} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import DraggableFlatList from 'react-native-draggable-flatlist'

export default class EditMenuScreen extends React.Component {
  state = {
    data: [...Array(20)].map((d, index) => ({
      key: `item-${index}`,
      name: "Hamburgare",
      price: index + 10,
      backgroundColor: `rgb(${Math.floor(Math.random() * 255)}, ${index * 5}, ${132})`,
    }))
  }

  renderItem = ({ item, index, move, moveEnd, isActive }) => {
    return (
      <TouchableOpacity
        style={{
          height: 100,
          backgroundColor: isActive ? 'blue' : item.backgroundColor,
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
        onLongPress={move}
        onPressOut={moveEnd}
      >
        <Text style={{
          fontWeight: 'bold',
          color: 'white',
          fontSize: 32,
        }}>
          {item.name}
        </Text>
        <Text style={{
          fontWeight: 'bold',
          color: 'black',
          fontSize: 32,
          backgroundColor: 'green',
        }}>
          {item.price}
        </Text>
      </TouchableOpacity>
    )
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <DraggableFlatList
          data={this.state.data}
          renderItem={this.renderItem}
          keyExtractor={(item, index) => `draggable-item-${item.key}`}
          scrollPercent={5}
          onMoveEnd={({ data }) => this.setState({ data })}
        />
      </View>
    )
  }
}
