import React, {Component} from 'react'
import {  StyleSheet, View, Text, TouchableWithoutFeedback, StatusBar,
  TextInput, SafeAreaView, Keyboard, TouchableOpacity,
  KeyboardAvoidingView} from 'react-native'
import axios from 'axios'

export default class RegisterUserScreen extends Component {

  constructor(props) {
    super(props)

    this.state = {
      name: '',
      email: '',
      password: '',
      company: '',
      orgnumber: '',
    }
  }

  signUpAxios() {
    const user = {
      email: 'daniel.herzegh@gmail.com',
      password: '12345678',
    }


    axios.post('https://mastega.nu/user/signup', { user })
    .then(res => {
      console.log(res)
    })
    .catch(function (error) {
      console.log(error)
    })
  }

  signUp() {
    console.log(this.state)
    var xmlhttp = new XMLHttpRequest()
    xmlhttp.onreadystatechange = function() {
      if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        var response = JSON.parse(xmlhttp.responseText)
        console.log('success', xmlhttp.responseText)
        if (response.success == false) {
          console.warn('error')
        }
      }
    }
    this.sendXHR(xmlhttp, 'POST', 'https://mastega.nu/user/signup', this.state, false)
  
    return false
  }

  sendXHR(req, method, url, data = null, needAuth = true, asynch = true) {
    req.open(method, url, asynch)
    req.send(JSON.stringify(data))
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
                  placeholder='Company'
                  placenholderTextColor='rgba(255,255,255,0.8)'
                  keyboardType='default'
                  returnKeyType='next'
                  onChangeText={(text) => this.setState({company:text})}
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
                  onChangeText={(text) => this.setState({orgnumber:text})}
                  // onSubmitEditing={() => { Keyboard.dismiss}}
                  autoCorrect={false}
                  blurOnSubmit={false}
                />
                <TouchableOpacity  style={styles.buttonContainer} onPress={() => this.signUpAxios()}>
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
    flex: 2,
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
    color: '#FFF',
  },
})
