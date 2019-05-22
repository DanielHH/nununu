import React from 'react'
import { View, Text, StyleSheet, FlatList } from 'react-native'
import { connect } from 'react-redux'
import { Card, Paragraph } from 'react-native-paper'

class DetailsScreen extends React.Component {

  static navigationOptions = {
    title: 'Details',
  }

  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', backgroundColor: '#e9ebee', padding:10}}>

        <Card
          style={{marginTop: 10}}
          flexDirection='row'>
          <Card.Content>
            <Text style={{fontSize: 30}}>{this.props.purchase.company.name}</Text>
            <Text style={{fontSize: 25}}>#{this.props.purchase.id}</Text>
            <Text style={{fontSize: 25}}>Completed: {String(this.props.purchase.completed)}</Text>
            <FlatList
              data={this.props.purchase.items}
              renderItem={({item}) => (
                <View style={{flex:1, flexDirection: 'row'}}>
                  <Paragraph>{item.quantity}</Paragraph>
                  <Paragraph>{item.name}</Paragraph>
                  <Paragraph>{item.pricePerItem}</Paragraph>
                </View>
              )}
              keyExtractor={(item, index) => index.toString()}/>
            <Text style={{fontSize: 15}}>Totaltpris: {this.props.purchase.totalPrice}</Text>
            <Text style={{fontSize: 15}}>Betald: {this.props.purchase.purchase_date}</Text>
          </Card.Content>
        </Card>
      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  let id = parseInt(ownProps.navigation.getParam('purchaseId'))
  for (let i = 0; i < state.purchase.purchases.length; i++) {
    if (state.purchase.purchases[i].id === id) {
      return {
        purchase: state.purchase.purchases[i],
      }
    }
  }
}

export default connect(mapStateToProps)(DetailsScreen)

const styles = StyleSheet.create({
  shadow: {
    textShadowOffset:{width:1, height:0},
    shadowOpacity:0.7
  },
  rotate: {
    position:'absolute',
    bottom: -200,
    transform: [
      {rotate: '270deg'},
      {scaleX: 2},
      {scaleY: 2}]
 },
})
