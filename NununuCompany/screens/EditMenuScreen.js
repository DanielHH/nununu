import React from 'react'
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native'
import DraggableFlatList from 'react-native-draggable-flatlist'
import ActionButton from 'react-native-action-button'
import { connection } from '../feathersSetup'

export default class EditMenuScreen extends React.Component {
  state = {
    data: [],
  }

  constructor(props) {
    super(props)
    // query that retrieves ALL the prodcts
    connection.productService.find({
      query: { },
    }).then((value) => {
      this.setState({data: value.data})
    }, (reason) => {
      // rejection
      console.log('error: ', reason)
    })
  }

  addArticle = (name, price) => {
    connection.productService.create({
      name: name,
      price: price,
    }).then((product) => {
      let data_copy = [...this.state.data]
      data_copy.push(product)
      this.setState({data: data_copy})
      this.props.navigation.goBack(null)
    }, (reason) => {
      // TODO: error handling
      console.log('error: ', reason)
    })
  }

  editArticle = (id, name, price) => {
    connection.productService.patch(id, {
      name: name,
      price: price,
    }).then((product) => {
      let data_copy = [...this.state.data]
      for (let i = 0; i < data_copy.length; i++) {
        if (data_copy[i].id === product.id) {
          data_copy[i] = product
        }
      }
      this.setState({data: data_copy})
      this.props.navigation.goBack(null)
    }, (reason) => {
      // TODO: error handling
      console.log('error: ', reason)
    })
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
        onPress={() => this.props.navigation.navigate('EditArticle', {editArticle: this.editArticle, item: item})}
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
          extraData={this.state}
          renderItem={this.renderItem}
          keyExtractor={(item, index) => item.id}
          scrollPercent={5}
          onMoveEnd={({ data }) => this.setState({ data })}
        />
        {/* Rest of the app comes ABOVE the action button component !*/}
        <ActionButton
          buttonColor="rgba(231,76,60,0.9)"
          position="center"
          onPress={() => this.props.navigation.navigate('AddArticle', {addArticle: this.addArticle})}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: 'white',
  },
})
