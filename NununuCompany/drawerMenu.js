import React, { Component } from 'react'
import {NavigationActions, DrawerItems} from 'react-navigation'
import {View, Button, SafeAreaView } from 'react-native'
import { connect } from 'react-redux'
import { removeToken } from './redux/actions'


class DrawerContentComponents extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <SafeAreaView style={{flex:1}}>
        <View forceInset={{ top: 'always', horizontal: 'never' }}>
          <DrawerItems {...this.props} />
          <Button title="Logout" onPress={() => {
            this.props.removeUserToken()}}/>
        </View>
      </SafeAreaView>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  removeUserToken: () => dispatch(removeToken())
})

export default connect(null, mapDispatchToProps)(DrawerContentComponents)
