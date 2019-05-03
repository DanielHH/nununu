import React, {Component} from 'react'
import {  StyleSheet, View, Text, Image, TouchableWithoutFeedback, StatusBar,
          TextInput, SafeAreaView, Keyboard, TouchableOpacity,
          KeyboardAvoidingView} from 'react-native'
import { connect } from 'react-redux'
import { signInUser, hideSuccessfulSignUpText } from '../redux/actions'

class LogInScreen extends Component {

  constructor(props) {
    super(props)

    this.state = {
      email: '',
      password: '',
    }
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle='light-content' />
        <KeyboardAvoidingView behavior='padding' style={styles.container}>
          <TouchableWithoutFeedback style={styles.container} onPress={Keyboard.dismiss}>
            <View style={styles.container}>
              <View style={styles.logoContainer}>
                <Image style={styles.logo} source={require('../images/nununu.png')}/>
                <Text style={styles.title}> Company </Text>
              </View>
              {this.props.showSuccessfulSignUp && (<Text style={styles.successfulSignup}>  Successfully signed up </Text>)}
              <View style={styles.infoContainer}>
                <TextInput style={styles.input}
                  placeholder='Enter username/email'
                  placenholderTextColor='rgba(255,255,255,0.8)'
                  onChangeText={(text) => this.setState({email:text})}
                  KeyboardType='email-address'
                  returnKeyType='next'
                  autoCorrect={false}
                  onSubmitEditing={()=> this.refs.txtPassword.focus()}
                  blurOnSubmit={false}
                />
                <TextInput style={styles.input}
                  placeholder='Enter password'
                  placenholderTextColor='rgba(255,255,255,0.8)'
                  onChangeText={(text) => this.setState({password:text})}
                  returnKeyType='go'
                  autoCorrect={false}
                  secureTextEntry={true}
                  ref={'txtPassword'}
                />
                <Text onPress={() => this.props.navigation.navigate('ForgotPSW')} style={styles.forgotPswText}>Forgot Password</Text>
                <TouchableOpacity style={styles.buttonContainer} onPress={() => this.props.signInUser(this.state.email, this.state.password)}>
                  <Text style={styles.buttonText}>SIGN IN</Text>
                </TouchableOpacity>
                <View style={styles.alternativeLogins}>
                  {/*<TouchableOpacity style={[styles.buttonContainer, styles.faceboookButton]}>
                    <Text style={styles.buttonText}>SIGN IN WITH FACEBOOK</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.buttonContainer, styles.faceboookButton, styles.googleButton]}>
                    <Text style={styles.buttonText}>SIGN IN WITH GOOGLE</Text>
                  </TouchableOpacity>*/}
                </View>
                <View style={styles.dividerDecorator}></View>
                <Text onPress={() => {this.props.hideSuccessfulSignUpText(false), this.props.navigation.navigate('Register')}} style={styles.signUpText}>Sign Up</Text>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </SafeAreaView>
    )
  }
}

const mapStateToProps = state => ({
  showSuccessfulSignUp: state.authentication.showSuccessfulSignUp,
})

const mapDispatchToProps = dispatch => ({
  signInUser: (email, password) => dispatch(signInUser(email,password)),
  hideSuccessfulSignUpText: () => dispatch(hideSuccessfulSignUpText())
})

export default connect(mapStateToProps, mapDispatchToProps)(LogInScreen)

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
  title: {
    color: '#f7c744',
    fontSize: 18,
    opacity: 0.75,
  },
  successfulSignup: {
    alignSelf: 'center',
    color: '#FFF',
  },
  infoContainer: {
    flex: 1,
    paddingHorizontal: 15,
    marginTop: 20,
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
  forgotPswText: {
      color: '#FFF',
      textDecorationLine: 'underline',
      alignSelf: 'flex-end',
      marginTop: -20,
      marginBottom: 20,
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
  alternativeLogins: {
    flexDirection: 'row',
  },
  faceboookButton: {
    flex: 1,
    marginTop: 10,
    backgroundColor: '#4267b2',
    marginHorizontal: 5,
  },
  googleButton: {
    backgroundColor: '#dd4b39'
  },
  dividerDecorator: {
    backgroundColor: '#FFF',
    height: 1,
    width: 100,
    marginTop: 30,
    marginBottom: 20,
    alignSelf: 'center'
  },
  signUpText: {
    color: '#fff',

    alignSelf: 'center'
  },
})
