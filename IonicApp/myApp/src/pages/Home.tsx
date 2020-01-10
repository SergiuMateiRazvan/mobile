import React, {useEffect, useState} from 'react';
import {Provider} from './context';
import {Task} from '../Model/task';
import {getTasks, putTask, deleteTask} from '../core/api';
import {State} from "../Model/state";


const initialState: State = {
    tasks: [],
    error: null,
    isLoading: false
};

const Home: React.FC = ({children}) => {
    const title = "Task manager";
    const [state, setState] = useState<State>(initialState);
    const {isLoading, tasks, error} = state;
    const refresh = () => {
        return getTasks().then(response => {
            return setState({tasks: response, isLoading: false});
        }).catch(error => {
            setState({error})
        });
    };
    useEffect(() => {
        setState({isLoading: true, error: null});
        refresh();
    }, []);

    const onSubmit = (task: Task) => {
        return putTask(task).then(refresh).catch(err => console.log(err));
    };
    const onDelete = (id: number) => {
        return deleteTask(id).then(refresh).catch(err => console.log(err));
    }
    return (
        <Provider value={{state, title, onSubmit, onDelete}}>
            {children}
        </Provider>
    );
};

export default Home;
