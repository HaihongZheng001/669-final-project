import React from 'react';
import { Button } from '@rneui/themed';
import { View, Text, StyleSheet, Alert, FlatList } from 'react-native';
import { signOut, getAuthUser } from '../AuthManager';

import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { subscribeToUserUpdates } from '../data/Actions';


function AppScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Account Page</Text>
      <Button
        onPress={async () => {
            try {
                await signOut();
                navigation.navigate('Login');
            } catch (error) {
                Alert.alert("Sign In Error", error.message,[{ text: "OK" }])
            }
        }}
      >
        Now sign out!
      </Button>
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
