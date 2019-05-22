import React from 'react'
import { View, Text, StyleSheet, FlatList } from 'react-native'
import { connect } from 'react-redux'
import { Card, Paragraph } from 'react-native-paper'

class DetailsScreen extends React.Component {

  static navigationOptions = {
    title: 'Details',
  }

  render() {
    let id = parseInt(this.props.navigation.getParam('purchaseId'))
    let purchase = null
    for (let i = 0; i < this.props.purchases.length; i++) {
      if (this.props.purchases[i].id === id) {
        purchase = this.props.purchases[i]
      }
    }
    return (
      <View style={{ flex: 1, alignItems: 'center', backgroundColor: '#e9ebee', padding:10}}>

        <Card
          style={{marginTop: 10}}
          flexDirection='row'>
          <Card.Content>
            <Text style={{fontSize: 30}}>{purchase.company.name}</Text>
            <Text style={{fontSize: 25}}>#{purchase.id}</Text>
            <Text style={{fontSize: 25}}>Completed: {String(purchase.completed)}</Text>
            <FlatList
              data={purchase.items}
              renderItem={({item}) => (
                <View style={{flex:1, flexDirection: 'row'}}>
                  <Paragraph>{item.quantity}</Paragraph>
                  <Paragraph>{item.name}</Paragraph>
                  <Paragraph>{item.pricePerItem}</Paragraph>
                </View>
              )}
              keyExtractor={(item, index) => index.toString()}/>
            <Text style={{fontSize: 15}}>Totaltpris: {purchase.totalPrice}</Text>
            <Text style={{fontSize: 15}}>Betald: {purchase.purchase_date}</Text>
          </Card.Content>
        </Card>
      </View>
    )
  }
}

const mapStateToProps = state => ({
  purchases: state.purchase.purchases,
})

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
