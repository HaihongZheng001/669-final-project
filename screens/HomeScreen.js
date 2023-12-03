import {useEffect} from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from '@rneui/themed';
import { generalStyles } from '../styles/Styles';
import { Header } from '../components/Header';

function HomeScreen({route, navigation}) {
  useEffect(()=>{
    console.log("route",route)
  }
  ,[navigation])
  return (
    <View style={styles.container}>
      <Header title={'Welcome to RMC'} showBackButton={false}/>
      <View style={styles.body}>
        <Text>Home Page</Text>

        <View style={styles.buttonContainer}>
          <Button
            onPress={() =>{
              navigation.navigate('EditReview')
            }}
          >
            Write a Review
          </Button>  
        </View> 

      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  ...generalStyles
});

export default HomeScreen;
