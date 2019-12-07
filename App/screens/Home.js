import React, {useState, useEffect, useContext, useCallback} from 'react';
import {getTasks, putTask, getLogger, apiUrl, wsUrl} from '../core';
import {Provider} from './context';
import {AuthContext} from '../auth/context';
import AsyncStorage from '@react-native-community/async-storage';
import {webSocket} from 'rxjs/webSocket';
import {useNetInfo} from '@react-native-community/netinfo';
import BackgroundJob from "react-native-background-job";

const putKey = "addUnsynched";
BackgroundJob.register({
    jobKey: putKey,
    job: () => {
        const info = useNetInfo();
        log("Executing Job");
        if (info.isConnected) {
            var tasks = getLocalTasks().filter(t => t.synched === 0);
            tasks.forEach(t => {
                putTask(t).catch(err => console.log(err));
            });
        }
    }
});

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
    const info = useNetInfo();

    const loadFromLocal = useCallback(async () => {
        const local = await getLocalTasks();
        log('local tasks');
        if (local.length > 0) {
            setState({tasks: local, isLoading: false});
        }
    });

    const addLocal = useCallback(async task => {
        await addLocalTask(task);
        // loadFromLocal();
    });

    const refresh = () => getTasks().then(removeTasks())
        .then(response => {
            let ids = '';
            response.forEach(task => {
                task.synched = 1;
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
        task.synched = 0;
        await addLocalTask(task);
        if (info.isConnected) {
            return putTask(task).catch(err => {
                console.log(err);
            });
        } else {
            return new Promise();
        }
    });

    const onSearch = (tasks, isSearching = true) => isSearching ? setState({
        tasks: tasks,
        isLoading: false
    }) : refresh();
    webSocket$.subscribe(({event, task}) => {
        if (event === 'created') {
            if (!tasks) return;
            log(JSON.stringify(task));
            task.synched = 1;
            const tasksLocal = tasks.filter(t => t.ID != task.key);
            tasksLocal.push(task);
            log('task received', JSON.stringify(task));
            addLocal(task);
            setState({tasks: tasksLocal, isLoading: false});
        }
    }, err => console.log(err));
    const value = {...state, onSubmit, onSearch};
    BackgroundJob.schedule({
        jobKey: putKey,
        notificationText: "Job executed",
        notificationTitle: "Background Job",
        period: 1000,
        allowWhileIdle: true,
        allowExecutionInForeground: true
    });
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
            await AsyncStorage.removeItem(IDS_KEY);
        }
    } catch (err) {
        console.log(err);
    }
};

const getLocalTasks = async () => {
    let tasksLocal = [];
    log('Get local tasks');
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
        // await AsyncStorage.removeItem(task.key.toString());
    } catch (err) {}
    try {
        await AsyncStorage.setItem(task.ID.toString(), JSON.stringify(task));
    } catch (err) {
    }
};
