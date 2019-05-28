import React from 'react'
import {View, Text, TextInput, Button, Picker} from 'react-native'
import { connect } from 'react-redux'
import { addProduct } from '../redux/actions'
import { editProduct } from '../redux/actions'

class ProductScreen extends React.Component {
  constructor(props) {
    super(props)
    let item = this.props.product
    if (item) {
      this.state = {
        id: item.id,
        name: item.name,
        price: item.price,
        description: item.description,
        categoryId: item.categoryId,
      }
    }
    else {
      this.state = {
        name: '',
        price: '',
        description: '',
        categoryId: this.props.currentCategoryId,
      }
    }
  }

  saveFunc = () => {
    if (this.state.id) { // edit product
      this.props.editProduct(this.state.id, this.state.name, 
        this.state.price, this.state.description, this.state.categoryId, this.props.token)
    } else { // new product
      this.props.addProduct(this.state.name, this.state.price, 
        this.state.description, this.state.categoryId, this.props.token)
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
          keyboardType="numeric"
          onChangeText={(price) => this.setState({price})}
          value={this.state.price}
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
        {/*}  <Text>
          Kategori
        </Text>
        <Picker
          selectedValue={this.state.categoryId}
          style={{height: 40}}
          onValueChange={(itemValue, itemIndex) =>
            this.setState({categoryId: itemValue})}>
          {this.props.categories.map((item, index) => {
            return (<Picker.Item label={item.name} value={item.id} key={index}/>) 
          })}
        </Picker>*/}
        <Button title="Spara" onPress={() => {this.saveFunc(), this.props.navigation.navigate('EditMenu')}}/>
      </View>
    )
  }
}

const mapStateToProps = state => ({
  token: state.authentication.token,
  categories: state.menu.categoriesOrder,
  product: state.menu.productToEdit,
  currentCategoryId: state.menu.currentCategoryId,
})

const mapDispatchToProps = dispatch => ({
  editProduct: (id, name, price, description, category, token) => dispatch(editProduct(id, name, price, description, category, token)),
  addProduct: (name, price, description, category, token) => dispatch(addProduct(name, price, description, category, token)),
})

export default connect(mapStateToProps, mapDispatchToProps)(ProductScreen)
