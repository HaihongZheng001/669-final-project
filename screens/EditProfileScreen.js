
import { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Alert } from 'react-native';
import { Button } from '@rneui/themed';
import { useDispatch } from 'react-redux';
import { signIn, signUp, subscribeToAuthChanges } from '../AuthManager';
import { Header } from '../components/Header';
import { generalStyles } from '../styles/Styles';


function EditProfileScreen({navigation}) {
  const [username, setUsername] = useState('');
  const [department, setDepartment] = useState('');
  const [currentMajor, setCurrentMajor] = useState('');
  const [undergraduateMajor, setUndergraduateMajor] = useState('');

  return (
    <View style={styles.container}>
      <Header title={'Edit Profile'}/>
      <View style={styles.body}>
        <View style={styles.listItemContainer}>
          <View style={styles.labelContainer}>
            <Text style={styles.labelText}>Username</Text>
          </View>
          <View style={styles.inputContainer}>
            <TextInput 
              style={styles.inputBox}
              autoCapitalize='none'
              spellCheck={false}
              value={"test1@gmail.com"}
              editable={false}
              backgroundColor={'lightgrey'}
              color={'grey'}
            />
          </View>
        </View>

        <View style={styles.listItemContainer}>
          <View style={styles.labelContainer}>
            <Text style={styles.labelText}>Department</Text>
          </View>
          <View style={styles.inputContainer}>
            <TextInput 
              style={styles.inputBox}
              placeholder='enter department' 
              autoCapitalize='none'
              spellCheck={false}
              onChangeText={text=>setDepartment(text)}
              value={department}
            />
          </View>
        </View>

        <View style={styles.listItemContainer}>
          <View style={styles.labelContainer}>
            <Text style={styles.labelText}>Current Major</Text>
          </View>
          <View style={styles.inputContainer}>
            <TextInput 
              style={styles.inputBox}
              placeholder='enter current major' 
              autoCapitalize='none'
              spellCheck={false}
              onChangeText={text=>setCurrentMajor(text)}
              value={currentMajor}
            />
          </View>
        </View>

        <View style={styles.listItemContainer}>
          <View style={styles.labelContainer}>
            <Text style={styles.labelText}>Undergraduate Major</Text>
          </View>
          <View style={styles.inputContainer}>
            <TextInput 
              style={styles.inputBox}
              placeholder='enter current major' 
              autoCapitalize='none'
              spellCheck={false}
              onChangeText={text=>setUndergraduateMajor(text)}
              value={undergraduateMajor}
            />
          </View>
        </View>
  
        <View style={styles.buttonContainer}>
          <Button
            onPress={() =>{
              console.log('submit profile!');
              navigation.navigate('Home');
            }}
          >
            Submit
          </Button>  
        </View> 
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
 ...generalStyles
});

export default EditProfileScreen;
