import React from 'react'
import { View, Text } from 'react-native'
import { Button as PaperButton} from 'react-native-paper'

import { createIconSetFromFontello } from 'react-native-vector-icons'
import fontelloConfig from '../config.json'
const Icon = createIconSetFromFontello(fontelloConfig)


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
          onPress={() => console.log(this.props.navigation.state.params)}>
          Go Homre!
        </PaperButton>
        <Text>
        <Icon name="ticketblack" size={100} color="#bf1313" />;
        </Text>

      </View>
    )
  }
}
