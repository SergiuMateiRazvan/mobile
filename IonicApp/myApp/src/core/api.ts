import React from "react";
import {Task} from '../Model/task';


export const apiUrl = 'http://172.30.119.215:3000';


export const getTasks = (): Promise<Task[]> => {
    return fetch(`${apiUrl}/tasks`).then(res => res.json() as Promise<Task[]>);
};
export const putTask = (task: Task): Promise<any> =>
    fetch(`${apiUrl}/tasks/task`, {
        method: 'POST',
        mode: 'cors',
        headers: {Accept: 'application/json', 'Content-Type': 'application/json'},
        body: JSON.stringify(task),
    });

export const deleteTask = (id: number): Promise<any> =>
    fetch(`${apiUrl}/tasks/task/${id}`, {
        method: 'DELETE'
    });
