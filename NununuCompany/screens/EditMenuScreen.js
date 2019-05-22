import React from 'react'
import {StyleSheet, View, TouchableOpacity} from 'react-native'
import DraggableFlatList from 'react-native-draggable-flatlist'
import ActionButton from 'react-native-action-button'
import { Card, Title, Paragraph} from 'react-native-paper'
import { connect } from 'react-redux'
import { goToEditProduct, goToAddProduct, reorderProducts } from '../redux/actions'

class EditMenuScreen extends React.Component {

  constructor(props) {
    super(props)
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
        onPress={() => {this.props.goToEditProduct(item), this.props.navigation.navigate('EditProduct')}}>
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
          data={this.props.categories[this.props.categoryId]}
          renderItem={this.renderItem}
          keyExtractor={(item, index) => item.id}
          scrollPercent={5}
          onMoveEnd={({ data }) => this.props.reorderProducts(this.props.categoryId, data, this.props.token.token)}
        />
        {/* Rest of the app comes ABOVE the action button component !*/}
        <ActionButton
          buttonColor="rgba(231,76,60,0.9)"
          position="center"
          onPress={() => {this.props.goToAddProduct(), this.props.navigation.navigate('AddProduct')}}
        />
      </View>
    )
  }
}

const mapStateToProps = state => ({
  categories: state.menu.categories,
  categoryId: state.menu.currentCategoryId,
  token: state.authentication.token,
})

const mapDispatchToProps = dispatch => ({
  goToEditProduct: (product) => dispatch(goToEditProduct(product)),
  goToAddProduct: () => dispatch(goToAddProduct()),
  reorderProducts: (categoryId, products, token) => dispatch(reorderProducts(categoryId, products, token)),
})

export default connect(mapStateToProps, mapDispatchToProps)(EditMenuScreen)

const styles = StyleSheet.create({
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: 'white',
  },
})
