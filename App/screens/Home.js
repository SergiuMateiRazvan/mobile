import React, {Component} from 'react';
import {getTasks, putTask, apiUrl, getLogger} from '../core';
import {Provider} from './context';

const log = getLogger('Home');

export class Home extends Component {
  state = {
    tasks: [],
    error: null,
    isLoading: true,
    onSubmit: this.handleAdd,
  };
  constructor(props) {
    super(props);
  }
  ws = new WebSocket(`${apiUrl}`);

  componentDidMount() {
    this.connectWebSocket();
    this.loadTasks();
    this.setState({onSubmit: this.handleAdd});
  }

  connectWebSocket = () => {
    log('WebSocket connection');
    this.ws.onopen = () => {
      log('connected');
    };
    this.ws.onmessage = ev => {
      log('Message: ' + ev.data);
      const tasks = this.state.tasks.filter(
        task => task.ID != JSON.parse(ev.data).ID,
      );
      tasks.push(JSON.parse(ev.data));
      this.setState({tasks});
    };
    this.ws.onclose = () => {
      log('disconnected');
    };
    this.ws.onerror = err => {
      log('Server encounted an error: ' + err);
    };
  };

  handleAdd = task => this.postTask(task);

  loadTasks = () => {
    log('Loading tasks...');
    this.setState({isLoading: true, error: null});
    getTasks()
      .then(response => response.json())
      .then(response => {
        this.setState({tasks: response, isLoading: false});
      })
      .catch(err => {
        this.setState({error: err, isLoading: false});
      });
  };

  postTask = task => {
    log('Posting task...');
    return putTask(task)
      .then(response => response.json())
      .catch(err => {
        console.log(err);
      });
  };

  render() {
    log('Rendering...');
    return <Provider value={this.state}>{this.props.children}</Provider>;
  }
}
