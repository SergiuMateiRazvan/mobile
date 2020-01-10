import React from 'react';
import {State} from "../Model/state";
import {Task} from "../Model/task";

interface Context {
    state?: State;
    title?: string;
    onSubmit?: (task: Task) => Promise<void>;
    onDelete?: (id: number) => Promise<void>;
}

export const {Provider, Consumer} = React.createContext<Context>({});
