import React from 'react'
import { Text } from 'react-native'

export default class RenderTitle extends React.Component {
  render() {
    return <Text>{this.props.title}</Text>
  }
}
