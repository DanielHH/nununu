import React from 'react'
import { View, Text, SectionList, StyleSheet} from 'react-native'
import { IconButton, Button, Card, Title, Paragraph} from 'react-native-paper'
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons'

export default class HomeScreen extends React.Component {
  state = {
    sections: {
      title: 'Hamburgare',
      data: [
        {name: 'La Mejicana', price: '79kr', quantity: 0},
        {name: 'Sukaldari', price: '95kr', quantity: 0},
        {name: 'BBQ Cheese', price: '89kr', quantity: 0},
        {name: 'The Original', price: '89kr', quantity: 0},
        {name: 'Angus', price: '89kr', quantity: 0}],
    },
  }

  changeQuantity(item, isAdd) {
    let dataCopy = {...this.state.sections}
    for (var i = 0; i < dataCopy.data.length; i++) {
      let food = dataCopy.data[i]
      if (food.name == item.name) {
        if (isAdd) {
          dataCopy.data[i].quantity++
        } else {
          if (dataCopy.data[i].quantity > 0) {
            dataCopy.data[i].quantity--
          }
        }
        if (dataCopy.data[i].quantity >= 0) {
          this.setState({
            sections : dataCopy,
          })
        }
      }
    }
  }

  navigateTo(screen) {
    this.props.navigation.navigate(screen, this.prepareOrder())
  }

  prepareOrder() {
    let selectedPurchaseItems = []
    let sections = {...this.state.sections}
    for (var i = 0; i < sections.data.length; i++) {
      if (sections.data[i].quantity > 0) {
        selectedPurchaseItems.push(sections.data[i])
      }
    }
    
    return selectedPurchaseItems
  }

  static navigationOptions = {
    title: 'Sukaldari',
    headerRight: (
      <MaterialCommunityIcons name="silverware-variant" size={24} style={{marginRight: 15}}/>
    ),
    headerStyle: {
      backgroundColor: '#f4511e',
    },
    headerTintColor: '#fff',
  };

  render() {
    return (
      <View style={styles.container}>

        <SectionList
          sections={[this.state.sections]}
          renderItem={({item}) => (

            <Card
              style={styles.item}
              flexDirection='row'>
              <Card.Content style={styles.cardContentContainer}>
                <View style={{flex:1, flexDirection: 'row'}}>
                  <View style={styles.foodInfo}>
                    <Title>{item.name + ' ' + item.price}</Title>
                    <Paragraph>Sallad, tomat, picklad rödlök, cheddarost & tuggdressing.</Paragraph>
                  </View>

                  <View style={styles.verticalDivider}/>

                  <View style={styles.quantity}>
                    <Ionicons name="ios-add" size={32} onPress={() => this.changeQuantity(item, true)}/>
                    <Text>{item.quantity}</Text>
                    <Ionicons name="ios-remove" size={32} onPress={() => this.changeQuantity(item, false)}/>
                  </View>
                </View>
              </Card.Content>
            </Card>

          )}
          renderSectionHeader={({section}) => <Text style={styles.sectionHeader}>{section.title}</Text>}
          keyExtractor={(item, index) => index}
        />
        <Button onPress={() => this.navigateTo('Details')}> Checka ut </Button>
      </View>
    )
  }
}

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
