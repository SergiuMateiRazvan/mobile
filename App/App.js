import React from 'react';
import {Text, StyleSheet} from 'react-native';

export default function App() {
  return <Text style={styles.middle}>Hello, World!</Text>;
}

const styles = StyleSheet.create({
  middle: {
    textAlign: 'center',
  },
});
