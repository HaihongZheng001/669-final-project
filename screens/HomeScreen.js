
import { Button } from '@rneui/themed';
import { View, Text, StyleSheet, Alert, FlatList } from 'react-native';
import { signOut, getAuthUser } from '../AuthManager';

import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { subscribeToUserUpdates } from '../data/Actions';


function HomeScreen({navigation}) {

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(subscribeToUserUpdates());
    }, []);


    const users = useSelector(state => state.users);
    const currentAuthUser = getAuthUser();

  return (
    <View style={styles.container}>
      <Text>
        You're signed in!  { currentAuthUser?.displayName }!
      </Text>
        {/* <View style={styles.listContainer}>
            <FlatList
                data={users}
                renderItem={({item}) => {
                    if (item.key === currentAuthUser?.uid) {
                        return (<View/>)
                    } else {
                        return (
                            <Text>{item.displayName}</Text>
                        )
                    }
                }}
            />
         </View> */}
      <Button
        // onPress={() => {
        //   navigation.navigate('Login');
        // }}

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
    backgroundColor: 'pink'
  },

    listContainer: {
        flex: 0.5,
        witdh: '100%',
    }
});
export default HomeScreen;