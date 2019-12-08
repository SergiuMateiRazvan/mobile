import React from 'react';
import {createStackNavigator} from 'react-navigation-stack';
import {TaskList} from './TaskList';
import {TaskEdit} from './TaskEdit';
import {Camera} from "./components/Camera";

export * from './Home';
export * from './TaskList';
export * from './TaskEdit';
export * from './styles';

export const Tasks = createStackNavigator({
  TaskList: {screen: TaskList},
  TaskEdit: {screen: TaskEdit},
  Camera: {screen: Camera}
});
