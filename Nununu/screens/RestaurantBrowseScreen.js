import React, { Component }from 'react'
import { View, Text, StyleSheet, SafeAreaView, SectionList} from 'react-native'
import { IconButton, Button, Card, Title, Paragraph} from 'react-native-paper'
import { MaterialCommunityIcons} from '@expo/vector-icons'

import { connect } from 'react-redux'
import { getCompanies } from '../redux/actions'

class RestaurantBrowseScreen extends Component {

  constructor(props) {
     super(props)

     this.props.getCompanies()
   }


  state = {
    data: [
      {
        title: '',
        data:[
          {name: 'Foodtrucken', category: 'Pizza', distance: '12km'},
          {name: 'Foodtrucken2', category: 'Pizza', distance: '12km'},
          {name: 'Foodtrucken3', category: 'Pizza', distance: '12km'},
        ]
      },
      {
        title: 'Closed Restaurants',
        data:[
          {name: 'Foodtrucken', category: 'Pizza', distance: '12km'},
          {name: 'Foodtrucken2', category: 'Pizza', distance: '12km'},
          {name: 'Foodtrucken3', category: 'Pizza', distance: '12km'},
        ]
      }
    ]
  }

  static navigationOptions = {
    title: 'Restaurants',
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
      <SafeAreaView style={styles.container}>
        <SectionList
          sections={this.state.data}
          renderItem={({item}) => (
            <Card
              style={styles.item}
              flexDirection='row'>
              <Card.Content style={styles.cardContentContainer}>
                <View style={{flex:1, flexDirection: 'row'}}>
                  <View style={styles.foodInfo}>
                    <Title>{item.name + ' | ' + item.category}</Title>
                    <Paragraph>{item.distance}</Paragraph>
                  </View>

                </View>
              </Card.Content>
            </Card>

          )}
          renderSectionHeader={({section}) => <Text style={styles.sectionHeader}>{section.title}</Text>}
          keyExtractor={(item, index) => index}
        />

      </SafeAreaView>
    )
  }
}

const mapStateToProps = state => ({
  showSuccessfulSignUp: state.authentication.showSuccessfulSignUp,
})

const mapDispatchToProps = dispatch => ({
  getCompanies: ( => dispatch(getCompanies()),

})

export default connect(mapStateToProps, mapDispatchToProps)(RestaurantBrowseScreen)


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

})
