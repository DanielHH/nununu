import React from 'react'
import {
  ActivityIndicator,
  AsyncStorage,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native'
import { connect } from 'react-redux'
import { getUserToken } from '../redux/actions'

class AuthLoadingScreen extends React.Component {
  constructor() {
    super()
    this._bootstrapAsync()
  }

  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {
    const userToken = await AsyncStorage.getItem('userToken')

    // This will switch to the App screen or Auth screen and this loading
    // screen will be unmounted and thrown away.
    console.log("#ASDASDASDASDASDASD")
    console.log(userToken)
    this.props.navigation.navigate(userToken ? 'App' : 'Auth')
  };

  // Render any loading content that you like here
  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
        <StatusBar barStyle="default" />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
})

const mapStateToProps = state => ({
  token: state.token,
})

const mapDispatchToProps = dispatch => ({
  getUserToken: () => dispatch(getUserToken()),
})

export default connect(mapStateToProps, mapDispatchToProps)(AuthLoadingScreen)
