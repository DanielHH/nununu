import React from 'react'
import { View, Text, SectionList, StyleSheet, Linking} from 'react-native'
import { IconButton, Button, Card, Title, Paragraph} from 'react-native-paper'
import { MaterialCommunityIcons} from '@expo/vector-icons'
import { getCompanyProducts, increaseProductQuantity, decreaseProductQuantity,
  postPurchase, startPaySwish, setSelectedPurchase } from '../redux/actions'
import { connect } from 'react-redux'
import DropDownHolder from '../components/DropDownHolder'
import RenderTitle from '../components/RenderTitle'

let TitleContainer = connect(state => ({ title: state.store.selectedCompany.name }))(RenderTitle)

class ProductsScreen extends React.Component {
  static navigationOptions = {
    headerTitle: <TitleContainer />,
    headerRight: (
      <MaterialCommunityIcons name="silverware-variant" size={24} style={{marginRight: 15}}/>
    ),
    headerStyle: {
      backgroundColor: '#f4511e',
    },
    headerTintColor: '#fff',
  }

  purchasePaid() {
    this.props.setSelectedPurchase(this.props.paidPurchase)
    this.props.navigation.navigate('Details')
  }

  prepareOrder() {
    let selectedPurchaseItems = []
    let sections = [...this.props.sections]
    for (let i = 0; i < sections.length; i++) {
      for (let j = 0; j < sections[i].data.length; j++) {
        if (sections[i].data[j].quantity > 0) {
          selectedPurchaseItems.push(sections[i].data[j])
        }
      }
    }
    return selectedPurchaseItems
  }

  componentDidMount() {
    this.props.getCompanyProducts(this.props.selectedCompany.id)
  }

  renderCard = (item, index, section) => {
    return (
      <Card
        style={styles.item}
        flexDirection='row'>
        <Card.Content style={styles.cardContentContainer}>
          <View style={{flex:1, flexDirection: 'row'}}>
            <View style={styles.foodInfo}>
              <Title>{item.name + ' ' + Math.round(item.price * 100) / 100}</Title>
              <Paragraph>Sallad, tomat, picklad rödlök, cheddarost & tuggdressing.</Paragraph>
            </View>
            <View style={styles.verticalDivider}/>
            <View style={styles.quantity}>
              <IconButton icon="add" size={24} onPress={() => this.props.increaseProductQuantity(index, section.title)}/>
              <Text>{item.quantity}</Text>
              <IconButton icon="remove" size={24} onPress={() => this.props.decreaseProductQuantity(index, section.title)}/>
            </View>
          </View>
        </Card.Content>
      </Card>
    )
  }

  render() {
    return (
      <View style={styles.container}>
        <SectionList
          sections={this.props.sections}
          renderItem={({item, index, section}) => (this.renderCard(item, index, section))}
          renderSectionHeader={({section}) => <Text style={styles.sectionHeader}>{section.title}</Text>}
          keyExtractor={(item, index) => index}
        />
        <Button onPress={() => this.props.postPurchase(this.prepareOrder())}> Checka ut </Button>
      </View>
    )
  }

  componentDidUpdate(prevProps) {
    if (this.props.unpaidPurchase !== prevProps.unpaidPurchase && this.props.unpaidPurchase !== null) {
      // make request to start pay with swish
      this.props.startPaySwish(this.props.unpaidPurchase.id)
    } else if (this.props.swishRequestToken !== prevProps.swishRequestToken && this.props.swishRequestToken !== null) {
      // retrieved a swish request token, open the swish app with it
      Linking.openURL('swish://paymentrequest?token=' + this.props.swishRequestToken)
    } else if (this.props.paidPurchase !== prevProps.paidPurchase && this.props.paidPurchase !== null) {
      // purchase paid for
      this.purchasePaid()
    } else if (this.props.purchaseError !== prevProps.purchaseError) {
      DropDownHolder.getDropDown().alertWithType('error', 'Error', this.props.purchaseError)
    }
  }
}

const mapStateToProps = state => ({
  sections: state.store.sections,
  selectedCompany: state.store.selectedCompany,
  swishRequestToken: state.purchase.swish_request_token,
  unpaidPurchase: state.purchase.unpaid_purchase,
  purchaseError: state.purchase.error,
  paidPurchase: state.purchase.paid_purchase,
})

const mapDispatchToProps = {
  getCompanyProducts,
  increaseProductQuantity,
  decreaseProductQuantity,
  postPurchase,
  startPaySwish,
  setSelectedPurchase,
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductsScreen)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#e9ebee'
  },
  sectionHeader: {
    paddingLeft: 10,
    paddingRight: 10,
    fontSize: 20,
    fontWeight: 'bold',
  },
  item: {
    flex: 1,
    margin: 5,
  },
  cardContentContainer: {
    marginTop: 10,
  },
  foodInfo: {
    flex: 3,
  },
  quantity: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  verticalDivider: {
    borderLeftWidth: 1,
    marginRight: 15,
    marginLeft: 5,
    borderLeftColor: 'gray',
  },
})
