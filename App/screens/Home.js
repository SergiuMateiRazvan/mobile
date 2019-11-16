import React, {useState, useEffect, useContext, useCallback} from 'react';
import {getTasks, putTask, getLogger} from '../core';
import {Provider} from './context';
import {AuthContext} from '../auth/context';
import AsyncStorage from '@react-native-community/async-storage';

const log = getLogger('Home');

const IDS_KEY = 'IDSKEY';

const initialState = {
  tasks: null,
  error: null,
  isLoading: false,
};

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

  useEffect(() => {
    if (token && !tasks && !error && !isLoading) {
      log('load tasks started');
      setState({isLoading: true, error: null});
      getTasks().then(removeTasks())
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
    }
  }, [token]);

  const onSubmit = useCallback(async task => {
    log('Posting task...');
    addLocal(task);
    return putTask(task)
      .then(response => {
        const tasksLocal = tasks.filter(task => task.ID.toString() !== response.key);
        tasksLocal.push(response);
        setState({tasks: tasksLocal, isLoading: false});
      })
      .catch(err => {
        console.log(err);
        addLocal(task);
      });
  });

  const value = {...state, onSubmit};
  log('Rendering...');
  return <Provider value={value}>{children}</Provider>;
};

const removeTasks = async () => {
  try {
    const ids = (await AsyncStorage.getItem(IDS_KEY)).split(' ');
    if (ids.length > 0) {
      ids.forEach(id => {
        AsyncStorage.removeItem(id);
      });
      AsyncStorage.removeItem(IDS_KEY);
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
