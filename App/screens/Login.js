import React, {Component} from 'react';
import {View, TextInput, Button, StyleSheet} from 'react-native';
import {navService} from '../core';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Input} from 'react-native-elements';

export class Login extends Component {
  static navigationOptions = {
    header: null,
  };
  render() {
    return (
      <View style={styles.container}>
        <Input placeholder="Email" />
        <Button title="Login" onPress={() => navService.navigate('Home')} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    height: 40,
    width: 300,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    margin: 20,
  },
});
