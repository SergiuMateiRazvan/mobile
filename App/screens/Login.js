import React, {Component} from 'react';
import {View, Text} from 'react-native';
import {navService} from '../core';
import Form from './Form';
import styles from './styles';
import {login} from '../core';

export class Login extends Component {
  static navigationOptions = {
    header: null,
  };
  state = {email: '', password: ''};

  handleLogin = () => {
    const {email, password} = this.state;
    // login(email, password)
    //   .then(() => {
    navService.navigate('Home', {user: email});
    // })
    // .catch(err => alert(err));
  };

  updateEmail = email => {
    this.setState({email});
  };

  updatePassword = password => {
    this.setState({password});
  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Login</Text>
        <Form
          onLogin={this.handleLogin}
          onEmailUpdate={this.updateEmail}
          onPasswordUpdate={this.updatePassword}
        />
      </View>
    );
  }
}
