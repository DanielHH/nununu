import React from 'react'
import {View, Text, TextInput, Button, Picker} from 'react-native'
import { connect } from 'react-redux'
import { addProduct } from '../redux/actions'
import { editProduct } from '../redux/actions'

class ProductScreen extends React.Component {
  constructor(props) {
    super(props)
    let item = this.props.navigation.state.params.item
    if (item) {
      this.state = {
        name: item.name,
        price: item.price,
        description: item.description,
        category: item.category,
        item: item,
      }
    }
    else {
      this.state = {
        name: '',
        price: '',
        description: '',
        category: '',
      }
    }
  }

  saveFunc = () => {
    if (this.state.item) { // edit product
      this.props.editProduct(this.state.item.id, this.state.name, 
        this.state.price, this.state.description, this.state.category, this.props.token.token)
    } else { // new product
      this.props.addProduct(0, this.state.name, this.state.price, 
        this.state.description, this.state.category, this.props.token.token)
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
        <Text>
          Beskrivning
        </Text>
        <TextInput
          style={{height: 40}}
          placeholder="Skriv en beskrivning här (valfritt)"
          onChangeText={(description) => this.setState({description})}
          value={this.state.description}
        />
        <Text>
          Kategori
        </Text>
        <Picker
          selectedValue={this.state.category}
          style={{height: 40}}
          onValueChange={(itemValue, itemIndex) =>
            this.setState({category: itemValue})
          }>
          <Picker.Item label="Burgers" value="Burgers" />
          <Picker.Item label="Drinks" value="Drinks" />
        </Picker>
        <Button title="Spara" onPress={() => this.saveFunc()}/>
      </View>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  editProduct: (id, name, price, description, category, token) => dispatch(editProduct(id, name, price, description, category, token)),
  addProduct: (id, name, price, description, category, token) => dispatch(addProduct(id, name, price, description, category, token)),
})

const mapStateToProps = state => ({
  token: state.authentication.token,
})

export default connect(mapStateToProps, mapDispatchToProps)(ProductScreen)
