import React, {Component} from 'react';
import {View, TextInput, Picker} from 'react-native';
import {Consumer} from './context';
import {Button} from 'react-native-elements';
import {getLogger} from '../core';

const log = getLogger('TaskEdit');

export class TaskEdit extends Component {
  state = {task: {Title: '', Description: '', Deadline: 0, Status: ''}};
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const {task} = this.props.navigation.state.params || this.state;
    this.setState({task});
  }

  render() {
    log('Rendering...');
    const {task} = this.state;
    return (
      <Consumer>
        {({onSubmit}) => (
          <View>
            <TextInput
              placeholder="Title"
              value={task && task.Title}
              onChangeText={text => {
                task.Title = text;
                this.setState({task});
              }}
            />
            <TextInput
              placeholder="Description"
              value={task && task.Description}
              onChangeText={text => {
                task.Description = text;
                this.setState({task});
              }}
            />
            <TextInput
              placeholder="Deadline"
              value={task && task.Deadline.toString()}
              onChangeText={text => {
                task.Deadline = text;
                this.setState({task});
              }}
            />
            <Picker
              selectedValue={task && task.Status}
              onValueChange={value => {
                task.Status = value;
                this.setState({task});
              }}>
              <Picker.Item label="To Do" value="To Do" />
              <Picker.Item label="In Progress" value="In Progress" />
              <Picker.Item label="Done" value="Done" />
            </Picker>
            <Button
              title="Submit"
              onPress={() => {
                onSubmit(task).then(() => this.props.navigation.goBack());
              }}
            />
          </View>
        )}
      </Consumer>
    );
  }
}
