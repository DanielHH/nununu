import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { connect } from 'react-redux'
import { Button as PaperButton} from 'react-native-paper'
import { Card } from 'react-native-paper'
//import { createIconSetFromFontello } from 'react-native-vector-icons'
import fontelloConfig from '../config.json'
import { MaterialIcons, MaterialCommunityIcons, createIconSetFromFontello } from '@expo/vector-icons'
const Icon = createIconSetFromFontello(fontelloConfig)


class DetailsScreen extends React.Component {

  static navigationOptions = {
    title: 'Details',
  }

  render() {


    return (
      <View style={{ flex: 1, alignItems: 'center', backgroundColor: '#e9ebee', padding:10}}>

        <Card
          style={{marginTop: 10}}
          flexDirection='row'>
          <Card.Content>
            <Text style={{fontSize: 30}}>Status: Tillagas</Text>
          </Card.Content>
        </Card>

        <Text style={{fontSize: 30, marginTop: 100}}>Status: {this.props.purchase.payment_status}</Text>
        <Text style={{fontSize: 25}}>Totalt: {this.props.purchase.totalPrice}</Text>

        { /*
        <Text style={styles.rotate}>
          <Icon style={styles.shadow} name="ticketblack" size={200} color="#eddbbf"/>
        </Text>
      */}

        <Text style={newStyles.rotate}>
          <MaterialIcons style={styles.shadow} name="confirmation-number" size={200} color="#eddbbf"/>
        </Text>

        <Text style={{position: 'absolute', bottom: 100, fontSize: 70}}>#{Math.floor(Math.random()*10 + 1)}</Text>

      </View>
    )
  }
}

const mapStateToProps = state => ({
  purchase: state.purchase.selected_purchase,
})

export default connect(mapStateToProps)(DetailsScreen)

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

const newStyles = StyleSheet.create({
  shadow: {
    textShadowOffset:{width:1, height:0},
    shadowOpacity:0.7
  },
  rotate: {
    position:'absolute',
    bottom: -60,
    transform: [
      {rotate: '90deg'},
      {scaleX: 2.5},
      {scaleY: 2.5}]
 },
})
