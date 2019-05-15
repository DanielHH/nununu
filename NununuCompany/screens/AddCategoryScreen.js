import React from 'react'
import {View, Text, TextInput, Button} from 'react-native'
import { connect } from 'react-redux'
import { addProduct } from '../redux/actions'

export default class AddCategoryScreen extends React.Component {

  constructor(props) {
    super(props)
    let item = this.props.navigation.state.params.item
    if (item) {
      this.state = {
        category: item.category,
        item: item,
      }
    }
    else {
      this.state = {
        category: '',
      }
    }
  }

  saveFunc = () => {
    this.props.navigation.state.params.addCategory(this.state.category)
  }

  render() {
    return (
      <View>
        <Text>
          Namn på Kategori
        </Text>
        <TextInput
          style={{height: 40}}
          placeholder="Skriv namn på kategori här"
          onChangeText={(category) => this.setState({category})}
          value={this.state.category}
        />
        <Button title="Spara" onPress={() => this.saveFunc()}/>
      </View>
    )
  }
}

/*
const mapDispatchToProps = dispatch => ({
  addProduct: (id, name, price, description, token) => dispatch(addProduct(id, name, price, description, token))
})

const mapStateToProps = state => ({
  token: state.authentication.token,
})


export default connect(mapStateToProps, mapDispatchToProps)(ProductScreen)
*/