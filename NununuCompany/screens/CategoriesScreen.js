import React from 'react'
import {StyleSheet, View, TouchableOpacity} from 'react-native'
import DraggableFlatList from 'react-native-draggable-flatlist'
import ActionButton from 'react-native-action-button'
import { Card, Title, Paragraph} from 'react-native-paper'
import { connect } from 'react-redux'
import { getCompanyProductsWithToken } from '../redux/actions'

class CategoriesScreen extends React.Component {
  state = {
  }

  constructor(props) {
    super(props)
  }

  addCategory = (category) => {
    let data_copy = [...this.state.data]
    data_copy.push({id: data_copy.length, category: category})
    this.setState({data: data_copy})
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
        onPress={() => this.props.navigation.navigate('EditMenu', {category: item.name})}>
        <Card style={{flex:1 ,margin:5, marginBottom:5}}>
          <Card.Content>
            <Title>{item.name}</Title>
          </Card.Content>
        </Card>
      </TouchableOpacity>
    )
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <DraggableFlatList
          data={this.props.categories}
          extraData={this.props}
          renderItem={this.renderItem}
          keyExtractor={(item, index) => item.id}
          scrollPercent={5}
          onMoveEnd={({ data }) => this.setState({ data })}
        />
        {/* Rest of the app comes ABOVE the action button component !*/}
        <ActionButton
          buttonColor="rgba(231,76,60,0.9)"
          position="center"
          onPress={() => this.props.navigation.navigate('AddCategory', {addCategory: this.addCategory})}
        />
      </View>
    )
  }
}

const mapStateToProps = state => ({
  categories: state.menu.categoriesOrder,
  category: state.menu.currentCategory,
  token: state.authentication.token,
})

const mapDispatchToProps = dispatch => ({
  getCompanyProductsWithToken: (token) => dispatch(getCompanyProductsWithToken(token)),

})

export default connect(mapStateToProps, mapDispatchToProps)(CategoriesScreen)

const styles = StyleSheet.create({
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: 'white',
  },
})
