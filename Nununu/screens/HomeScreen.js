import React from 'react'
import { View, Text, SectionList, StyleSheet} from 'react-native'
import { IconButton, Button, Card, Title, Paragraph} from 'react-native-paper'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

export default class HomeScreen extends React.Component {
  state = {
    sections: {
      title: 'Hamburgare',
      data: [
        {name: 'La Mejicana', price: '79kr'},
        {name: 'Sukaldari', price: '95kr'},
        {name: 'BBQ Cheese', price: '89kr'},
        {name: 'The Original', price: '89kr'},
        {name: 'Angus', price: '89kr'}],
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
              style={styles.item}
              flexDirection='row'>
              <Card.Content style={styles.cardContentContainer}>
                <View style={{flex:1, flexDirection: 'row'}}>
                  <View style={styles.foodInfo}>
                    <Title>{item.name + ' ' + item.price}</Title>
                    <Paragraph>Sallad, tomat, picklad rödlök, cheddarost & tuggdressing.</Paragraph>
                  </View>

                  <View
                    style={{
                    borderLeftWidth: 1,
                    marginRight: 15,
                    marginLeft: 5,
                    borderLeftColor: 'gray',
                    }}
                  />

                  <View style={styles.quantity}>
                    <IconButton icon="add" size={24} onPress={() => console.log('Pressed')}/>
                    <Text>2</Text>
                    <IconButton icon="remove" size={24} onPress={() => console.log('Pressed')}/>
                  </View>
                </View>
              </Card.Content>
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

})
