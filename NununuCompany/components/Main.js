import React, { Component } from 'react'
import { connect } from 'react-redux'
import { AuthenticationStack } from '../navigation'
import Authenticated from './Authenticated'


class Main extends Component {

  render() {

    if (this.props.token == null) {
      // USER NOT SIGNED IN
      return (
        <AuthenticationStack />
      )
    } else {
      return (
        <Authenticated />
      )
    }
  }
}

const mapStateToProps = state => ({
  token: state.authentication.token,
})

export default connect(mapStateToProps)(Main)
