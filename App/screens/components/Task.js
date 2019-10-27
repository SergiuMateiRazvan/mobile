import React from 'react';
import {Text, View, StyleSheet} from 'react-native';

export default ({task = {}}) => {
  return (
    <View style={styles.listColumn}>
      <Text style={styles.listCell}>{task.Title}</Text>
      <Text style={[styles.listCell, {flex: 3}]}>{task.Description}</Text>
      <Text style={styles.listCell}>{task.Deadline}</Text>
      <Text style={styles.listCell}>{task.Status}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  listColumn: {
    flex: 1,
    flexDirection: 'row',
    textAlign: 'center',
    alignItems: 'stretch',
    marginTop: 10,
  },
  listCell: {
    flex: 1,
    textAlign: 'center',
    alignItems: 'center',
  },
});
