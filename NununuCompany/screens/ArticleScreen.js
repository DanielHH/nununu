import React from 'react'
import {View, Text, TextInput, Button} from 'react-native'

export default class ArticleScreen extends React.Component {

  constructor(props) {
    super(props)
    let item = this.props.navigation.state.params.item
    if (item) {
      this.state = {
        name: item.name,
        price: item.price,
        item: item,
      }
    }
    else {
      this.state = {
        name: '',
        price: '',
      }
    }
  }

  saveFunc = () => {
    if (this.state.item) { // edit article
      this.props.navigation.state.params.editArticle(this.state.item.id, this.state.name, this.state.price)
    } else { // new article
      this.props.navigation.state.params.addArticle(this.state.name, this.state.price)
    }
  }

  render() {
    return (
      <View>
        <Text>
          Namn
        </Text>
        <TextInput
          style={{height: 40}}
          placeholder="Skriv namn här"
          onChangeText={(name) => this.setState({name})}
          value={this.state.name}
        />
        <Text>
          Pris
        </Text>
        <TextInput
          style={{height: 40}}
          placeholder="Skriv pris här"
          onChangeText={(price) => this.setState({price})}
          value={this.state.price.toString()}
        />
        <Button title="Spara" onPress={() => this.saveFunc()}/>
      </View>
    )
  }
}
