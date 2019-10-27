import React from 'react';
import {Text, View, StyleSheet} from 'react-native';

export default () => {
  return (
    <View style={styles.container}>
      <Text style={styles.column}>Title</Text>
      <Text style={[styles.column, {flex: 3}]}>Description</Text>
      <Text style={styles.column}>Deadline</Text>
      <Text style={styles.column}>Status</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'center',
    marginTop: 5,
  },
  column: {
    flex: 1,
    textAlign: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
});
