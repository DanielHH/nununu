import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
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
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#e9ebee'}}>
        <Text style={styles.rotate}>
          <Icon style={styles.shadow} name="ticketblack" size={200} color="#eddbbf"/>
        </Text>
        <Text style={{position: 'absolute', bottom: 50}}>{this.props.navigation.state.params[0].name}</Text>
        <Text style={{position: 'absolute', bottom: 40}}>{this.props.navigation.state.params[0].price}</Text>
        <Text style={{position: 'absolute', bottom: 30}}>{this.props.navigation.state.params[0].quantity}</Text>

      </View>
    )
  }
}

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
