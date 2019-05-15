import React from 'react'
import { View, FlatList, SafeAreaView, StyleSheet } from 'react-native'
import { Card, Title, Paragraph} from 'react-native-paper'
import { connect } from 'react-redux'
import { getCompanies, setSelectedCompany } from '../redux/actions'
import { MaterialCommunityIcons} from '@expo/vector-icons'

class CompaniesScreen extends React.Component {

  componentDidMount() {
    this.props.getCompanies()
  }

  displayCompany = (company) => {
    this.props.setSelectedCompany(company)
    this.props.navigation.navigate('Products')
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
        <FlatList
          data={this.props.companies}
          renderItem={({item}) => (
            <Card
              onPress={() => this.displayCompany(item)}
              style={styles.item}
              flexDirection='row'>
              <Card.Content style={styles.cardContentContainer}>
                <View style={{flex:1, flexDirection: 'row'}}>
                  <View style={styles.foodInfo}>
                    <Title>{item.name}</Title>
                    <Paragraph>{item.distance}</Paragraph>
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
  companies: state.store.companies,
})

const mapDispatchToProps = {
  getCompanies,
  setSelectedCompany,
}

export default connect(mapStateToProps, mapDispatchToProps)(CompaniesScreen)

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
