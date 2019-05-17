import React from 'react'
import { View, FlatList, SafeAreaView, StyleSheet } from 'react-native'
import { Card, Title, Paragraph} from 'react-native-paper'
import { connect } from 'react-redux'
import { setSelectedPurchase } from '../redux/actions'

class PurchasesScreen extends React.Component {

  displayPurchase = (purchase) => {
    this.props.setSelectedPurchase(purchase)
    this.props.navigation.navigate('Details')
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <FlatList
          data={this.props.purchases}
          renderItem={({item}) => (
            <Card
              onPress={() => this.displayPurchase(item)}
              style={styles.item}
              flexDirection='row'>
              <Card.Content style={styles.cardContentContainer}>
                <View style={{flex:1, flexDirection: 'row'}}>
                  <View style={styles.foodInfo}>
                    <Title>{item.company.name}</Title>
                    <Paragraph>{item.purchaseMessage}</Paragraph>
                    <Paragraph>Totalpris: {item.totalPrice}</Paragraph>
                    <Paragraph>Betald: {item.purchase_date}</Paragraph>
                  </View>
                </View>
              </Card.Content>
            </Card>
          )}
          keyExtractor={(item, index) => index.toString()}/>
      </SafeAreaView>
    )
  }
}

const mapStateToProps = state => ({
  purchases: state.purchase.purchases,
})

const mapDispatchToProps = {
  setSelectedPurchase,
}

export default connect(mapStateToProps, mapDispatchToProps)(PurchasesScreen)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#e9ebee'
  },
  item: {
    flex: 1,
    margin: 5,
  },
  cardContentContainer: {
    marginTop: 10,
  },
})
