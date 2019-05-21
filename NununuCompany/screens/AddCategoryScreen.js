import React from 'react'
import {View, Text, TextInput, Button} from 'react-native'
import { connect } from 'react-redux'
import { addCategory } from '../redux/actions'

class AddCategoryScreen extends React.Component {

  state = {
    name: '',
  }

  constructor(props) {
    super(props)
  }

  saveFunc = () => {
    this.props.addCategory(this.state.name, this.props.token.token)
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
          onChangeText={(name) => this.setState({name})}
          value={this.state.category}
        />
        <Button title="Spara" onPress={() => {this.saveFunc(), this.props.navigation.navigate('Categories')}}/>
      </View>
    )
  }
}

const mapStateToProps = state => ({
  token: state.authentication.token,
})

const mapDispatchToProps = dispatch => ({
  addCategory: (name, token) => dispatch(addCategory(name, token)),
})


export default connect(mapStateToProps, mapDispatchToProps)(AddCategoryScreen)
