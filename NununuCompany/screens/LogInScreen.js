import React, {Component} from 'react'
import {  StyleSheet, View, Text, Image, TouchableWithoutFeedback, StatusBar,
          TextInput, SafeAreaView, Keyboard, TouchableOpacity,
          KeyboardAvoidingView} from 'react-native'

export default class LogInScreen extends Component {

  constructor(props) {
    super(props)
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle='light-content' />
        <KeyboardAvoidingView behaviour='padding' style={styles.container}>
          <TouchableWithoutFeedback style={styles.container} onPress={Keyboard.dismiss}>
            <View style={styles.container}>
              <View style={styles.logoContainer}>
                <Image style={styles.logo} source={require('../images/nununu.png')}/>
                <Text style={styles.title}> Company </Text>
              </View>
              <View style={styles.infoContainer}>
                <TextInput style={styles.input}
                  placeholder='Enter username/email'
                  placenholderTextColor='rgba(255,255,255,0.8)'
                  KeyboardType='email-address'
                  returnKeyType='next'
                  autoCorrect={false}
                  onSubmitEditing={()=> this.refs.txtPassword.focus()}
                  blurOnSubmit={false}
                />
                <TextInput style={styles.input}
                  placeholder='Enter password'
                  placenholderTextColor='rgba(255,255,255,0.8)'
                  KeyboardType='email-address'
                  returnKeyType='go'
                  autoCorrect={false}
                  secureTextEntry={true}
                  ref={'txtPassword'}
                />
                <TouchableOpacity style={styles.buttonContainer}>
                  <Text style={styles.buttonText}>SIGN IN</Text>
                </TouchableOpacity>
                <View style={styles.alternativeLogins}>
                  <TouchableOpacity style={[styles.buttonContainer, styles.faceboookButton]}>
                    <Text style={styles.buttonText}>SIGN IN WITH FACEBOOK</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.buttonContainer, styles.faceboookButton, styles.googleButton]}>
                    <Text style={styles.buttonText}>SIGN IN WITH GOOGLE</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </SafeAreaView>
    )
  }
}

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
  }

})
