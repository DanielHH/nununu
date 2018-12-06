import React, {Component} from 'react'
import {FlatList, StyleSheet, View} from 'react-native'
import ListItem from './ListItem'
import { connect } from 'react-redux'
import { completeOrder, setActive } from '../redux/actions'
import PropTypes from 'prop-types'

class SwipeableList extends Component {
  static contextTypes = {
    store: PropTypes.object.isRequired,
  }
  constructor(props) {
    super(props)
    this.renderSeparator = this.renderSeparator.bind(this)
    this.success = this.success.bind(this)
    this.setScrollEnabled = this.setScrollEnabled.bind(this)

    this.state = {
      enable: true,
      data: this.props.data,
    }
    this.context.store.dispatch(setActive(this.state.data))
    console.log('next state', this.context.store.getState())
  }

  renderSeparator() {
    return (
      <View style={styles.separatorViewStyle}>
        <View style={styles.separatorStyle} />
      </View>
    )
  }

  success(key) {
    const data = this.state.data.filter(item => item.key !== key)
    this.setState({
      data,
    })
    const action = completeOrder(item => item.key === key)
    console.log('dispatching', action)
    this.context.store.dispatch(action)
    console.log('next state', this.context.store.getState())
  }

  setScrollEnabled(enable) {
    this.setState({
      enable,
    })
  }

  renderItem(item) {
    return (
      <ListItem
        id={item.key}
        content={item.content}
        orderNumber={item.orderNumber}
        success={this.success}
        setScrollEnabled={enable => this.setScrollEnabled(enable)}
      />
    )
  }

  render() {
    return (
      <FlatList
        style={this.props.style}
        data={this.state.data}
        ItemSeparatorComponent={this.renderSeparator}
        renderItem={({item}) => this.renderItem(item)}
        scrollEnabled={this.state.enable}
      />
    )
  }
}

export default connect((state) => {
  return {
    active: state.order.active,
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
