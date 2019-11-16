import React, {useState, useEffect, useContext, useCallback} from 'react';
import {getTasks, putTask, getLogger, apiUrl, wsUrl} from '../core';
import {Provider} from './context';
import {AuthContext} from '../auth/context';
import AsyncStorage from '@react-native-community/async-storage';
import { webSocket } from 'rxjs/webSocket';

const log = getLogger('Home');

const IDS_KEY = 'IDSKEY';

const initialState = {
  tasks: null,
  error: null,
  isLoading: false,
};
const webSocket$ = webSocket(`${wsUrl}/tasks`);

export const Home = ({children}) => {
  const [state, setState] = useState(initialState);
  const {isLoading, tasks, error} = state;
  const {token} = useContext(AuthContext);

  const loadFromLocal = useCallback(async () => {
    const local = await getLocalTasks();
    log('local tasks');
    if (local.length > 0) {
      setState({tasks: local, isLoading: false});
    }
  });

  const addLocal = useCallback(async task => {
    await addLocalTask(task);
    loadFromLocal();
  });

  const refresh = () => getTasks().then(removeTasks())
      .then(response => {
        let ids = '';
        response.forEach(task => {
          AsyncStorage.setItem(task.ID.toString(), JSON.stringify(task));
          ids += task.ID.toString() + ' ';
        });
        AsyncStorage.setItem(IDS_KEY, ids);
        setState({tasks: response, isLoading: false});
      })
      .catch(err => {
        console.log('Error: ', err);
        loadFromLocal();
        setState({error: err[0], isLoading: false});
      });

  useEffect(() => {
    if (token && !tasks && !error && !isLoading) {
      log('load tasks started');
      setState({isLoading: true, error: null});
      refresh();
    }
  }, [token]);

  const onSubmit = useCallback(async task => {
    log('Posting task...');
    return putTask(task).catch(err => {
      console.log(err);
    });
  });

  const onSearch = (tasks, isSearching=true) => isSearching ? setState({tasks: tasks, isLoading: false}) : refresh();
  webSocket$.subscribe(({ event, task }) => {
    if (event === 'created') {
        if(!tasks) return;
        log(JSON.stringify(task));
        const tasksLocal = tasks.filter(t => t.ID !== task.key);
        // delete task.lastId;
        tasksLocal.push(task);
        //addLocal(task);
        setState({tasks: tasksLocal, isLoading: false});
    }
  }, err => console.log(err));
  const value = {...state, onSubmit, onSearch};
  log('Rendering...');
  log(JSON.stringify(state.tasks));
  return <Provider value={value}>{children}</Provider>;
};

const removeTasks = async () => {
  try {
    const ids = (await AsyncStorage.getItem(IDS_KEY)).split(' ');
    if (ids.length > 0) {
      ids.forEach(id => {
        AsyncStorage.removeItem(id);
      });
      await AsyncStorage.removeItem(IDS_KEY);
    }
  } catch (err) {
    console.log(err);
  }
};

const getLocalTasks = async () => {
  let tasksLocal = [];
  try {
    const ids = (await AsyncStorage.getItem(IDS_KEY)).split(' ');
    if (ids.length > 0) {
      for (let i = 0; i < ids.length; i++) {
        if (ids[i]) {
          const task = await AsyncStorage.getItem(ids[i]);
          tasksLocal.push(JSON.parse(task));
        }
      }
    }
  } catch (err) {
    console.log('LocalError: ', err);
  }
  return tasksLocal;
};

const addLocalTask = async task => {
  try {
    await AsyncStorage.removeItem(task.ID.toString());
  } catch (err) {}
  try {
    await AsyncStorage.setItem(task.ID.toString(), JSON.stringify(task));
  } catch (err) {}
};
