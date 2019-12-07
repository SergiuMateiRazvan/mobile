import React, {useContext} from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Button,
  TouchableOpacity,
} from 'react-native';
import {Consumer} from './context';
import Task from './components/Task';
import styles from './styles';
import Header from './components/ListHeader';
import Hr from 'react-native-hr-component';
import {getLogger} from '../core';
import {AuthContext} from '../auth/context';
import Search from './components/Search';
const log = getLogger('TaskList');

export const TaskList = ({navigation}) => {
  log('Rendering...');
  const {onLogout} = useContext(AuthContext);

  return (
    <View style={styles.container}>
      <Text style={styles.title}> My Tasks</Text>
      <Consumer>
        {({tasks, error, isLoading, onSearch}) => (
          <View style={listStyles.listContainer}>
            <Search onChangeState={onSearch} />
            <ActivityIndicator animating={isLoading} size="large" style={{display: 'none'}} />
            {error && <Text>{error || 'Loading error'}</Text>}
            {tasks && <Header />}
            <Hr text="+" />
            {tasks && (
              <FlatList
                data={tasks.map(item => ({
                  ...item,
                  key: item.ID.toString() || Math.random().toString(),
                }))}
                renderItem={({item}) => (
                  <TouchableOpacity
                    onPress={() => {
                      log('Row pressed');
                      navigation.navigate('TaskEdit', {task: item});
                    }}>
                    <Task styles={styles.listColumn} task={item} />
                  </TouchableOpacity>
                )}
              />
            )}
          </View>
        )}
      </Consumer>
      <View style={listStyles.logoutView}>
        <Button
          onPress={() => {
            onLogout().then(() => navigation.navigate('Auth'));
          }}
          title="Logout"
        />
      </View>
      <View style={listStyles.buttonView}>
        <Button
          title="Add"
          color="rgb(255,50,10)"
          onPress={() => navigation.navigate('TaskEdit')}
        />
      </View>
    </View>
  );
};

TaskList.navigationOptions = () => ({
  header: null,
});

const listStyles = StyleSheet.create({
  listContainer: {
    flex: 1,
    alignItems: 'stretch',
    width: '100%',
    textAlign: 'center',
  },
  buttonView: {
    position: 'absolute',
    bottom: '5%',
    right: '3%',
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
  logoutView: {
    position: 'absolute',
    bottom: '5%',
    left: '3%',
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
});
