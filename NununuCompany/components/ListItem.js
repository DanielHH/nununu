import React from 'react'
import {View, Text, StyleSheet, Animated, Dimensions, PanResponder} from 'react-native'
import { IconButton, Card, Title, Paragraph} from 'react-native-paper'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
const {width} = Dimensions.get('window')

export default class ListItem extends React.PureComponent {
  constructor(props) {
    super(props)

    this.gestureDelay = -35
    this.scrollViewEnabled = true

    const position = new Animated.ValueXY()
    const panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => false,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onPanResponderTerminationRequest: (evt, gestureState) => false,
      onPanResponderMove: (evt, gestureState) => {
        if (gestureState.dx > 35) {
          this.setScrollViewEnabled(false)
          let newX = gestureState.dx + this.gestureDelay
          position.setValue({x: newX, y: 0})
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dx < 150) {
          Animated.timing(this.state.position, {
            toValue: {x: 0, y: 0},
            duration: 150,
          }).start(() => {
            this.setScrollViewEnabled(true)
          })
        } else {
          Animated.timing(this.state.position, {
            toValue: {x: width, y: 0},
            duration: 300,
          }).start(() => {
            this.props.success(this.props.id)
            this.setScrollViewEnabled(true)
          })
        }
      },
    })

    this.panResponder = panResponder
    this.state = {position}
  }

  setScrollViewEnabled(enabled) {
    if (this.scrollViewEnabled !== enabled) {
      this.props.setScrollEnabled(enabled)
      this.scrollViewEnabled = enabled
    }
  }

  render() {
    return (
      <View style={styles.listItem}>
        <View style={styles.absoluteCell}>
          <Icon style={{marginLeft: 10,}}name="check" size={42} color="white"/>
        </View>
        <Animated.View style={[this.state.position.getLayout()]} {...this.panResponder.panHandlers}>
          <View style={styles.innerCell}>
            <Card style={{margin:5, marginBottom:1,}}>
              <Card.Content>
                <Title>Order: {this.props.orderNumber}</Title>
                <Paragraph>{this.props.content}</Paragraph>
              </Card.Content>
            </Card>
          </View>
        </Animated.View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  listItem: {
    flex:1,

  },
  absoluteCell: {
    position: 'absolute',
    marginTop:10,
    marginLeft:10,
    height: 80,
    top: 0,
    bottom: 0,
    left: 0,
    width: width - 20,
    backgroundColor: 'green',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',

  },
  absoluteCellText: {

  },

})
