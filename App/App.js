import React from 'react';
import {Text} from 'react-native';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {Login, Home} from './screens';
import {navService} from './core';

const MainNavigator = createStackNavigator({
  Login: {screen: Login},
  Home: {screen: Home},
});

const AppContainer = createAppContainer(MainNavigator);

export default function App() {
  return (
    <AppContainer
      ref={navigatorRef => {
        navService.setTopLevelNavigator(navigatorRef);
      }}
    />
  );
}
