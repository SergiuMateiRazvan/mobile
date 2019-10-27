import React from 'react';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {TaskList, Home, TaskEdit} from './screens';
import {navService} from './core';
import {YellowBox} from 'react-native';

YellowBox.ignoreWarnings(['Setting a timer']);
const MainNavigator = createStackNavigator({
  TasksView: {screen: TaskList},
  TasksEdit: {screen: TaskEdit},
});

const AppContainer = createAppContainer(MainNavigator);

export default function App() {
  return (
    <Home>
      <AppContainer
        ref={navigatorRef => {
          navService.setTopLevelNavigator(navigatorRef);
        }}
      />
    </Home>
  );
}
