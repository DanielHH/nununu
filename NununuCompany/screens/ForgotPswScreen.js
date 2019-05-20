import React, {Component} from 'react'
import {  StyleSheet, View, Text, TouchableWithoutFeedback, StatusBar,
  TextInput, SafeAreaView, Keyboard, TouchableOpacity,
  KeyboardAvoidingView} from 'react-native'

import { connect } from 'react-redux'
import { resetPassword } from '../redux/actions'

class ForgotPswScreen extends Component {

  constructor(props) {
    super(props)

    this.state = {
      email: '',
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.resetPasswordEmailSent !== prevProps.resetPasswordEmailSent &&
    this.props.resetPasswordEmailSent) {
      this.props.navigation.navigate('Login')
    }
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle='light-content' />
        <KeyboardAvoidingView style={styles.container}  behavior='padding'>
          <TouchableWithoutFeedback style={styles.container} onPress={Keyboard.dismiss}>
            <View style={styles.container}>
              <View style={styles.descriptionContainer}>
                <Text style={styles.pswTitle}>Forgot your password?</Text>
                <Text style={styles.description}> Please submit your email and {'\n'} we will reset your password.</Text>
              </View>
              <View style={styles.infoContainer}>
                <TextInput style={styles.input}
                  placeholder='Enter email'
                  placenholderTextColor='rgba(255,255,255,0.8)'
                  keyboardType='email-address'
                  returnKeyType='done'
                  autoCorrect={false}
                  onChangeText={(text) => this.setState({email:text})}
                  onSubmitEditing={() => this.props.resetPassword(this.state.email)}
                />
                <TouchableOpacity style={styles.buttonContainer} onPress={() =>  this.props.resetPassword(this.state.email)}>
                  <Text style={styles.buttonText}>Submit</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </SafeAreaView>
    )
  }
}

const mapStateToProps = state => ({
  resetPasswordEmailSent: state.authentication.resetPasswordEmailSent,
})

const mapDispatchToProps = dispatch => ({
  resetPassword: (email) => dispatch(resetPassword(email))
})

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPswScreen)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(35, 53, 70)',
    flexDirection: 'column',
  },
  logoContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    height: 56,
    width: 128,
  },
  title:{
    color: '#f7c744',
    fontSize: 18,
    opacity: 0.75,
  },
  descriptionContainer:{
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pswTitle:{
    color: '#f7c744',
    fontSize: 24,
    opacity: 0.75,
  },
  description:{
    color: '#f7c744',
    fontSize: 14,
    opacity: 0.75,
  },
  infoContainer: {
    flex: 1,
    paddingHorizontal: 15,
    //backgroundColor: 'red',
  },
  input: {
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    color: '#FFF',
    paddingHorizontal: 10,
    marginBottom: 20,
    borderRadius: 64,
  },
  buttonContainer: {
    backgroundColor: '#f7c744',
    borderRadius: 64,
    paddingVertical: 15,
  },
  buttonText: {
    textAlign: 'center',
    color: '#FFF'
  },
})
