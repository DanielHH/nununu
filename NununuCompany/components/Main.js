import React, { Component } from 'react'
import Drawer from '../navigation'
import { connect } from 'react-redux'
import { AuthenticationStack } from '../navigation'
import { getCompanyProductsWithToken, emptyMenuState } from '../redux/actions'

class Main extends Component {
  render() {
    if (this.props.token == null) {
      // USER NOT SIGNED IN
      return (
        <AuthenticationStack />
      )
    } else {
      return (
        <Drawer />
      )
    }
  }
  componentDidUpdate(prevProps) {
    if (this.props.token !== prevProps.token &&
    this.props.token) {
      this.props.getCompanyProductsWithToken(this.props.token)
    } else if (this.props.token !== prevProps.token &&
      !this.props.token) {
      this.props.emptyMenuState() 
    }
  } 
}

const mapStateToProps = state => ({
  token: state.authentication.token,
})

const mapDispatchToProps = dispatch => ({
  getCompanyProductsWithToken: (token) => dispatch(getCompanyProductsWithToken(token)),
  emptyMenuState: () => dispatch(emptyMenuState()),
})

export default connect(mapStateToProps, mapDispatchToProps)(Main)
