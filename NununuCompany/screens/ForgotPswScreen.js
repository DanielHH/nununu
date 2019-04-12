import React, {Component} from 'react'
import {  StyleSheet, View, Text, Image, TouchableWithoutFeedback, StatusBar,
  TextInput, SafeAreaView, Keyboard, TouchableOpacity,
  KeyboardAvoidingView} from 'react-native'

export default class ForgotPswScreen extends Component {

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
              {/*
              <View style={styles.logoContainer}>
                <Image style={styles.logo} source={require('../images/nununu.png')}/>
                <Text style={styles.title}> Company </Text>
              </View>
              */}
              <View style={styles.descriptionContainer}>
                <Text style={styles.pswTitle}>Forgot your password?</Text>
                <Text style={styles.description}> Please submit your email and {'\n'} we will reset your password.</Text>
              </View>
              <View style={styles.infoContainer}>
                <TextInput style={styles.input}
                  placeholder='Enter email'
                  placenholderTextColor='rgba(255,255,255,0.8)'
                  KeyboardType='email-address'
                  returnKeyType='go'
                  autoCorrect={false}
                  blurOnSubmit={false}
                />
                <TouchableOpacity style={styles.buttonContainer}>
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
