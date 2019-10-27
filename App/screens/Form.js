import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Input} from 'react-native-elements';
import styles from './styles';
import {Button} from 'react-native';

const Form = props => {
  return (
    <React.Fragment>
      <Input
        name="email"
        containerStyle={styles.input}
        inputStyle={styles.labels}
        placeholder="Email"
        autoCompleteType="email"
        autoCapitalize="none"
        autoFocus={true}
        leftIcon={<Icon name="envelope" />}
        onChangeText={text => {
          props.onEmailUpdate(text);
        }}
      />
      <Input
        name="password"
        containerStyle={styles.input}
        placeholder="Password"
        autoCapitalize="none"
        secureTextEntry={true}
        leftIcon={<Icon name="unlock-alt" />}
        onChangeText={text => {
          props.onPasswordUpdate(text);
        }}
      />
      <Button title="Login" onPress={props.onLogin} />
    </React.Fragment>
  );
};

export default Form;
