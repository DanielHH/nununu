process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
import React, {Component} from 'react'
import {  StyleSheet, View, Text, TouchableWithoutFeedback, StatusBar,
  TextInput, SafeAreaView, Keyboard, TouchableOpacity,
  KeyboardAvoidingView} from 'react-native'
import { connect } from 'react-redux'
import { signUpUser } from '../redux/actions'
class SignUpUserScreen extends Component {

  constructor(props) {
    super(props)

    this.state = {
      name: '',
      email: '',
      password: '',
      companyName: '',
      orgnumber: '',
    }
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle='light-content' />
        <KeyboardAvoidingView style={styles.container} behavior='padding'>
          <TouchableWithoutFeedback style={styles.container} onPress={Keyboard.dismiss}>
            <View style={styles.container}>
              <View style={styles.descriptionContainer}>
                <Text style={styles.title}>Sign Up User and Company</Text>
                <Text style={styles.description}> Please fill in the following and submit it to {'\n'} start a request for signing up a new account.</Text>
              </View>
              {this.props.error.signUpError && (<Text style={styles.SignUpError}> Failed to sign up new user </Text>)}
              <View style={styles.infoContainer}>
                <TextInput style={styles.input}
                  placeholder='Your name'
                  placenholderTextColor='rgba(255,255,255,0.8)'
                  keyboardType='default'
                  returnKeyType='next'
                  onChangeText={(text) => this.setState({name:text})}
                  onSubmitEditing={() => { this.emailInput.focus() }}
                  autoCorrect={false}
                  blurOnSubmit={false}
                />
                <TextInput style={styles.input}
                  ref={(input) => { this.emailInput = input }}
                  placeholder='Email'
                  placenholderTextColor='rgba(255,255,255,0.8)'
                  keyboardType='email-address'
                  returnKeyType='next'
                  onChangeText={(text) => this.setState({email:text})}
                  onSubmitEditing={() => { this.passwordInput.focus() }}
                  autoCorrect={false}
                  blurOnSubmit={false}
                />
                <TextInput style={styles.input}
                  ref={(input) => { this.passwordInput = input }}
                  placeholder='Password'
                  placenholderTextColor='rgba(255,255,255,0.8)'
                  keyboardType='default'
                  returnKeyType='next'
                  secureTextEntry={true}
                  onChangeText={(text) => this.setState({password:text})}
                  onSubmitEditing={() => { this.companyInput.focus() }}
                  autoCorrect={false}
                  blurOnSubmit={false}
                />
                <TextInput style={styles.input}
                  ref={(input) => { this.companyInput = input }}
                  placeholder='Company Name'
                  placenholderTextColor='rgba(255,255,255,0.8)'
                  keyboardType='default'
                  returnKeyType='next'
                  onChangeText={(text) => this.setState({companyName:text})}
                  onSubmitEditing={() => { this.organisationInput.focus() }}
                  autoCorrect={false}
                  blurOnSubmit={false}
                />
                <TextInput style={styles.input}
                  ref={(input) => { this.organisationInput = input }}
                  placeholder='Organisation number'
                  placenholderTextColor='rgba(255,255,255,0.8)'
                  keyboardType='numeric'
                  returnKeyType='done'
                  onChangeText={(text) => this.setState({orgnumber:text})}
                  autoCorrect={false}
                  onSubmitEditing={() => this.props.signUpUser(this.state)}
                />
                <TouchableOpacity  style={styles.buttonContainer} onPress={() => this.props.signUpUser(this.state)}>
                  <Text style={styles.buttonText}>Submit</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </SafeAreaView>
    )
  }
  componentDidUpdate(prevProps) {
    if (this.props.showSuccessfulSignUp !== prevProps.showSuccessfulSignUp &&
    this.props.showSuccessfulSignUp) {
      this.props.navigation.navigate('Login')
    }
  }
}

const mapDispatchToProps = dispatch => ({
  signUpUser: (email, password) => dispatch(signUpUser(email,password)),
})

const mapStateToProps = state => ({
  showSuccessfulSignUp: state.authentication.showSuccessfulSignUp,
  error: state.authentication.error,
})

export default connect(mapStateToProps, mapDispatchToProps)(SignUpUserScreen)

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
  descriptionContainer:{
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title:{
    color: '#f7c744',
    fontSize: 24,
    opacity: 0.75,
  },
  description:{
    color: '#f7c744',
    fontSize: 14,
    opacity: 0.75,
    textAlign: 'center'
  },
  SignUpError: {
    alignSelf: 'center',
    color: '#F00',
  },
  infoContainer: {
    flex: 2,
    paddingHorizontal: 15,
    marginTop: 20,
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
    color: '#FFF',
  },
})
