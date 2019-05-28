import React, { Component } from 'react'
import Drawer from '../navigation'
import { connect } from 'react-redux'
import { connect as wsConnect, send } from '@giantmachines/redux-websocket'
import constants from '../constants'


class Authenticated extends Component {

  componentDidMount() {
    this.props.wsConnect('ws' + (constants.TRANSPORT_LAYER_SECURITY ? 's' : '') + '://' + constants.SERVER_ADDRESS + '/ws/connect/company')
  }

  render() {
    return (
      <Drawer />
    )
  }

  componentDidUpdate(prevProps) {
    if (this.props.open !== prevProps.open && this.props.open !== false) {
      // websocket opened (or reopened)
      this.props.send({'token': this.props.token})
    }
  }
}

const mapStateToProps = state => ({
  open: state.purchase.open,
  token: state.authentication.token,
})

const mapDispatchToProps = {
  wsConnect,
  send,
}

export default connect(mapStateToProps, mapDispatchToProps)(Authenticated)
