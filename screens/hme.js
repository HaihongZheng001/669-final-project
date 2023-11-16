import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

function AppScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Home page</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default AppScreen;
