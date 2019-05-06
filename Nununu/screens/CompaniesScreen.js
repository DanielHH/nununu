import React from 'react'
import { FlatList, Text } from 'react-native'
import { connect } from 'react-redux'
import { getCompanies, setSelectedCompany } from '../redux/actions'

class CompaniesScreen extends React.Component {

  componentDidMount() {
    this.props.dispatch(getCompanies())
  }

  displayCompany = (company) => {
    this.props.dispatch(setSelectedCompany(company))
    this.props.navigation.navigate('Products')
  }

  render() {
    return (
      <FlatList
        data={this.props.companies}
        renderItem={({item}) => <Text onPress={() => this.displayCompany(item)}>{item.name}</Text>}
        keyExtractor={(item, index) => index.toString()}
      />
    )
  }
}

export default connect((state) => {
  return {
    companies: state.store.companies,
  }
})(CompaniesScreen)
