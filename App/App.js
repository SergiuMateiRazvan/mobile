import React from 'react';
import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {Tasks, Home} from './screens';
import {navService} from './core';
import {AuthLoading, AuthStore, Auth} from './auth';

const AppContainer = createAppContainer(
  createSwitchNavigator(
    {AuthLoading, Tasks, Auth},
    {initialRouteName: 'AuthLoading'},
  ),
);

const App = () => {
  return (
    <AuthStore>
      <Home>
        <AppContainer
          ref={navigatorRef => {
            navService.setTopLevelNavigator(navigatorRef);
          }}
        />
      </Home>
    </AuthStore>
  );
};

export default App;
