import React from 'react'
import {StyleSheet, View, TouchableOpacity} from 'react-native'
import DraggableFlatList from 'react-native-draggable-flatlist'
import ActionButton from 'react-native-action-button'
import { Card, Title, Paragraph} from 'react-native-paper'

export default class EditMenuScreen extends React.Component {
  state = {
    data: [
      {id: 0, name: 'La Mejicana', price: '79', description: 'bmb'},
      {id: 1, name: 'Sukaldari', price: '95', description: 'bmb'},
      {id: 2, name: 'BBQ Cheese', price: '89', description: 'bmb'},
      {id: 3, name: 'The Original', price: '89', description: 'bmb'},
      {id: 4, name: 'Angus', price: '89', description: 'bmb'}],
  }

  addArticle = (name, price, description) => {
    let data_copy = [...this.state.data]
    data_copy.push({id: data_copy.length, name: name, price: price, description: description})
    this.setState({data: data_copy})
    this.props.navigation.goBack(null)
  }

  editArticle = (id, name, price, description) => {
    let data_copy = [...this.state.data]
    for (let i = 0; i < data_copy.length; i++) {
      if (data_copy[i].id === id) {
        data_copy[i].name = name
        data_copy[i].price = price
        data_copy[i].description = description
        this.setState({data: data_copy})
        break
      }
    }
    this.props.navigation.goBack(null)
  }

  renderItem = ({ item, index, move, moveEnd, isActive }) => {
    return (
      <TouchableOpacity
        style={{
          backgroundColor: isActive ? 'gray' : item.backgroundColor,
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
        onLongPress={move}
        onPressOut={moveEnd}
        onPress={() => this.props.navigation.navigate('EditArticle', {editArticle: this.editArticle, item: item})}>
        <Card style={{flex:1 ,margin:5, marginBottom:5}}>
          <Card.Content>
            <Title>{item.name}</Title>
            <Paragraph> {item.price} kr</Paragraph>
            <Paragraph> {item.description}</Paragraph>
          </Card.Content>
        </Card>
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
