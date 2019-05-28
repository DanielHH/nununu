import React, { Component } from 'react'
import { connect } from 'react-redux'
import { connect as wsConnect, send } from '@giantmachines/redux-websocket'
import constants from '../constants'
import { AppContainer } from '../navigation'
import uuidv4 from 'uuid/v4'
import { setPurchaserId } from '../redux/actions'
import { Linking } from 'expo'

const prefix = Linking.makeUrl('/')

class Main extends Component {

  componentDidMount() {
    if (this.props.purchaser_id === null) {
      // generate id
      let new_purchaser_id = uuidv4()
      this.props.setPurchaserId(new_purchaser_id)
    } else {
      this.connectWs()
    }
  }

  connectWs = () => {
    this.props.wsConnect('ws' + (constants.TRANSPORT_LAYER_SECURITY ? 's' : '') + '://' + constants.SERVER_ADDRESS + '/ws/connect/purchaser')
  }

  render() {
    return <AppContainer uriPrefix={prefix}/>
  }

  componentDidUpdate(prevProps) {
    if (this.props.open !== prevProps.open && this.props.open !== false) {
      // websocket opened (or reopened)
      this.props.send({'purchaser_id': this.props.purchaser_id})
    } else if (this.props.purchaser_id !== prevProps.purchaser_id && this.props.purchaser_id !== null) {
      // new purchaser_id was generated
      this.connectWs()
    }
  }
}

const mapStateToProps = state => ({
  open: state.purchase.ws_open,
  purchaser_id: state.purchase.purchaser_id,
})

const mapDispatchToProps = {
  wsConnect,
  send,
  setPurchaserId,
}

export default connect(mapStateToProps, mapDispatchToProps)(Main)
