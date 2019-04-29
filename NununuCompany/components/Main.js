import React, { Component } from 'react'
import Drawer from '../navigation'
import { connect } from 'react-redux'
import { AuthenticationStack } from '../navigation'

class Main extends Component {
  render() {

    if (this.props.token == null) {
      // USER NOT SIGNED IN
      console.log("TOKEN00", this.props.token)
      return (
        <AuthenticationStack />
      )
    } else {
      console.log("TOKEN01", this.props.token)
      return (
        <Drawer />
      )
    }
  }
}

const mapStateToProps = state => ({
  token: state.authentication.token,
})

export default connect(mapStateToProps)(Main)
