import React from 'react';
import {View, Text, ActivityIndicator, Button} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Input} from 'react-native-elements';
import styles from '../screens/styles';
import {Consumer} from './context';

export const Login = ({navigation}) => {
  const [email, onChangeMail] = React.useState('');
  const [password, onChangePassword] = React.useState('');

  return (
    <Consumer>
      {({onLogin, loginError, loginInProgress}) => (
        <View style={styles.container}>
          <Text style={styles.title}>Login</Text>
          <ActivityIndicator animating={loginInProgress} size="large" />
          {loginError && <Text>{loginError.message || 'Login error'}</Text>}
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
              onChangeMail(text);
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
              onChangePassword(text);
            }}
          />
          <Button
            title="Login"
            onPress={() => {
              onLogin(email, password).then(() => navigation.navigate('Tasks'));
            }}
          />
        </View>
      )}
    </Consumer>
  );
};

Login.navigationOptions = () => ({
  header: null,
});
