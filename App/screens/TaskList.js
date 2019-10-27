import React, {Component} from 'react';
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
import {navService, getLogger} from '../core';

const log = getLogger('TaskList');

export class TaskList extends Component {
  static navigationOptions = {
    header: null,
  };
  constructor(props) {
    super(props);
  }

  actionOnRow = task => {
    log('Row pressed');
    navService.navigate('TasksEdit', {task: task});
  };
  render() {
    log('Rendering...');
    return (
      <View style={styles.container}>
        <Text style={styles.title}> My Tasks</Text>
        <Consumer>
          {({tasks, error, isLoading}) => (
            <View style={listStyles.listConstainer}>
              <ActivityIndicator animating={isLoading} size="large" />
              {error && <Text>{error || 'Loading error'}</Text>}
              {tasks && <Header />}
              <Hr text="+" />
              {tasks && (
                <FlatList
                  data={tasks.map(item => ({
                    ...item,
                    key: item.ID || Math.random(),
                  }))}
                  renderItem={({item}) => (
                    <TouchableOpacity onPress={() => this.actionOnRow(item)}>
                      <Task styles={styles.listColumn} task={item} />
                    </TouchableOpacity>
                  )}
                />
              )}
            </View>
          )}
        </Consumer>
        <View style={listStyles.buttonView}>
          <Button
            title="Add"
            color="rgb(255,50,10)"
            onPress={() => navService.navigate('TasksEdit')}
          />
        </View>
      </View>
    );
  }
}

const listStyles = StyleSheet.create({
  listConstainer: {
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
});
