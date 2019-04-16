import React, {Component} from 'react'
import {  StyleSheet, View, Text, TouchableWithoutFeedback, StatusBar,
  TextInput, SafeAreaView, Keyboard, TouchableOpacity,
  KeyboardAvoidingView} from 'react-native'

export default class RegisterUserScreen extends Component {

  constructor(props) {
    super(props)
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle='light-content' />
        <KeyboardAvoidingView style={styles.container} behavior='padding'>
          <TouchableWithoutFeedback style={styles.container} onPress={Keyboard.dismiss}>
            <View style={styles.container}>
              <View style={styles.descriptionContainer}>
                <Text style={styles.title}>Register User and Company</Text>
                <Text style={styles.description}> Please fill in the following and submit it to {'\n'} start a request for registering a new user.</Text>
              </View>
              <View style={styles.infoContainer}>
               {/* <TextInput style={styles.input}
                  placeholder='Your name'
                  placenholderTextColor='rgba(255,255,255,0.8)'
                  keyboardType='default'
                  returnKeyType='next'
                  onSubmitEditing={() => { this.emailInput.focus() }}
                  autoCorrect={false}
                  blurOnSubmit={false}
                />*/}
                <TextInput style={styles.input}
                  ref={(input) => { this.emailInput = input }}
                  placeholder='Email'
                  placenholderTextColor='rgba(255,255,255,0.8)'
                  keyboardType='email-address'
                  returnKeyType='next'
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
                  onSubmitEditing={() => { this.companyInput.focus() }}
                  autoCorrect={false}
                  blurOnSubmit={false}
                />
                <TextInput style={styles.input}
                  ref={(input) => { this.companyInput = input }}
                  placeholder='Company'
                  placenholderTextColor='rgba(255,255,255,0.8)'
                  keyboardType='default'
                  returnKeyType='next'
                  onSubmitEditing={() => { this.organisationInput.focus() }}
                  autoCorrect={false}
                  blurOnSubmit={false}
                />
                <TextInput style={styles.input}
                  ref={(input) => { this.organisationInput = input }}
                  placeholder='Organisation number'
                  placenholderTextColor='rgba(255,255,255,0.8)'
                  keyboardType='numeric'
                  returnKeyType='go'
                  //onSubmitEditing={() => { this.emailInput.focus() }}
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
  },
  infoContainer: {
    flex: 1,
    paddingHorizontal: 15,
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
