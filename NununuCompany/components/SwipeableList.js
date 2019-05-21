import React, {Component} from 'react'
import {FlatList, StyleSheet, View} from 'react-native'
import ListItem from './ListItem'
import { connect } from 'react-redux'
import { completeOrder, setActiveOrders } from '../redux/actions'
import listData from '../components/ListData'

class SwipeableList extends Component {

  constructor(props) {
    super(props)
    this.renderSeparator = this.renderSeparator.bind(this)
    this.success = this.success.bind(this)
    this.setScrollEnabled = this.setScrollEnabled.bind(this)
    this.props.dispatch(setActiveOrders(listData))
    this.state = {
      enable: true,
    }
  }

  renderSeparator() {
    return (
      <View style={styles.separatorViewStyle}>
        <View style={styles.separatorStyle} />
      </View>
    )
  }

  success(id) {
    this.props.dispatch(completeOrder(id))
  }

  setScrollEnabled(enable) {
    this.setState({
      enable,
    })
  }

  renderItem(item) {
    return (
      <ListItem
        id={item.id}
        content={item.purchaseMessage}
        orderNumber={item.id}
        success={this.success}
        setScrollEnabled={enable => this.setScrollEnabled(enable)}
      />
    )
  }

  render() {
    return (
      <FlatList
        style={this.props.style}
        data={this.props.active}
        backgroundColor={'#e9ebee'}
        renderItem={({item}) => this.renderItem(item)}
        keyExtractor={(item, index) => String(item.id)}
        scrollEnabled={this.state.enable}
      />
    )
  }
}

export default connect((state) => {
  return {
    active: state.websocket.active_purchases,
  }
})(SwipeableList)

const styles = StyleSheet.create({
  separatorViewStyle: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  separatorStyle: {
    height: 1,
    backgroundColor: '#000',
  },
})
