import React from 'react'
import { View, Text } from 'react-native'
import { Button as PaperButton} from 'react-native-paper'


export default class DetailsScreen extends React.Component {

  static navigationOptions = {
    title: 'Details',
  }

  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Details Screen</Text>
        <PaperButton
          mode='contained'
          onPress={() => this.props.navigation.navigate('Home')}>
          Go Home!
          </PaperButton>
      </View>
    )
  }
}
