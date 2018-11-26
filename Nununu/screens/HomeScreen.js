import React from 'react'
import { View, Text, FlatList, SectionList, StyleSheet} from 'react-native'
import { Appbar, Button, Card, Title, Paragraph} from 'react-native-paper'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

export default class HomeScreen extends React.Component {
  state = {
    sections: {
      title: 'Hamburgare',
      data: [
        {name: 'La Mejicana', price: '10kr'},
        {name: 'Sukaldari', price: '10kr'},
        {name: 'BBQ Cheese', price: '10kr'}],
    },
  }

  static navigationOptions = {
    title: 'Sukaldari',
    headerRight: (
      <Icon name="silverware-variant" size={24} style={{marginRight: 15}}/>
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
              style={styles.item}>
              <Card.Content>
                <View styles={styles.cardContentContainer}>
                    <Title>{item.name}</Title>
                    <Paragraph>{item.price}</Paragraph>
                </View>
              </Card.Content>
              <Card.Actions>
                <Button onPress={() => this.props.navigation.navigate('Details')}>Lägg till</Button>
              </Card.Actions>
            </Card>
          )}
          renderSectionHeader={({section}) => <Text style={styles.sectionHeader}>{section.title}</Text>}
          keyExtractor={(item, index) => index}
        />
        <Button onPress={() => this.props.navigation.navigate('Details')}> Checka ut </Button>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  sectionHeader: {
    paddingLeft: 10,
    paddingRight: 10,
    fontSize: 20,
    fontWeight: 'bold',
  },
  item: {
    flex: 1,
    margin: 10,
  },
  cardContentContainer: {
    flex: 1,
  },
  testCont: {
    flex: 1,
  },
  half1: {
    flex: 2,
    backgroundColor: 'blue',
  },
  half2: {
    flex: 1,
    backgroundColor: 'red',
  },
})
