
import { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard,} from 'react-native';
// import { Button } from '@rneui/themed';
import { signIn, signUp, subscribeToAuthChanges } from '../AuthManager';
import { Header } from '../components/Header';
import { generalStyles } from '../styles/Styles';
import { useSelector, useDispatch } from 'react-redux';
import { loadUsers, updateUser } from '../data/Actions';
import { getAuth } from 'firebase/auth';
import { Button } from 'react-native-paper';

function EditProfileScreen( props ) {
  const { navigation, route } = props;
  const [department, setDepartment] = useState('');
  const [currentMajor, setCurrentMajor] = useState('');
  const [undergraduateMajor, setUndergraduateMajor] = useState('');

  const [curUserName, setCurUserName] = useState('')
  const users = useSelector(state => state.users)
  // console.log('users!!', users)
  const dispatch = useDispatch();
  const [curUser, setCurUser] = useState({})
  const [loginUser, setLoginUser] = useState(null);


  useEffect(()=>{
    dispatch(loadUsers());
  }, []);

  useEffect(() => {
    const auth = getAuth();
    auth.onAuthStateChanged((user) => {
      // console.log('!!auth user', user)
      setLoginUser(user);
    });
  }, []);

  useEffect(() => {
    let currentUser;
    if (loginUser) {
      currentUser = users.find(user => user.email === loginUser.email);
    }
    if (currentUser) {
      setCurUserName(currentUser.name)
      setCurUser(prevUser => {
        const user = users.find(user => user.email === loginUser.email && user.id);
        setDepartment(user.department || '');
        setCurrentMajor(user.currentMajor || '');
        setUndergraduateMajor(user.undergraduateMajor || '');
        return user;
      })
    }
  }, [users])

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>

    <KeyboardAvoidingView 
      behavior='padding'
      keyboardVerticalOffset={300}
      style={styles.container}
    >
      <Header title={'Edit Profile'} navigation={navigation} showBackButton={true}/>

      {/* <KeyboardAvoidingView 
        behavior='padding'
        keyboardVerticalOffset={350}
        style={styles.body}
      > */}
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
              value={curUserName}
              editable={false}
              backgroundColor={'#F3EDFF'}
              color={'grey'}
            />
          </View>
        </View>

        <View style={styles.listItemContainer}>
          <View style={styles.labelContainer}>
            <Text style={styles.labelText}>User Email</Text>
          </View>
          <View style={styles.inputContainer}>
            <TextInput 
              style={styles.inputBox}
              autoCapitalize='none'
              spellCheck={false}
              value={loginUser? loginUser.email : 'placeholder'}
              editable={false}
              backgroundColor={'#F3EDFF'}
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
              autoCapitalize='none'
              spellCheck={false}
              onChangeText={text=>setDepartment(text)}
              value={department}
              // value={curUser.department&& curUser.department.length != 0 ? curUser.department:department}
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
              autoCapitalize='none'
              spellCheck={false}
              onChangeText={text=>setCurrentMajor(text)}
              // value={curUser.currentMajor&& curUser.currentMajor.length != 0 ? curUser.currentMajor:currentMajor}
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
              autoCapitalize='none'
              spellCheck={false}
              onChangeText={text=>setUndergraduateMajor(text)}
              value={undergraduateMajor}
              // value={curUser.undergraduateMajor&& curUser.undergraduateMajor.length != 0 ? curUser.undergraduateMajor:undergraduateMajor}
            />
          </View>
        </View>
  
        <View style={styles.pairButtonContainer}>
          <Button
            style={{ borderRadius: '6%', justifyContent: 'center', backgroundColor:'#A66319', width: '30%', }}
            mode={'contained'}
            labelStyle={{ fontSize: 14 }}
            onPress={() =>{
              navigation.navigate('AccountPage');
            }}
          >
            Cancel
          </Button>  
          <Button
            style={{ borderRadius: '6%', justifyContent: 'center',backgroundColor:'#5F32D1', width: '30%',}}
            mode={'contained'}
            labelStyle={{ fontSize: 14 }}
            onPress={() =>{
              dispatch(updateUser({
                ...curUser,
                department: department,
                currentMajor: currentMajor,
                undergraduateMajor: undergraduateMajor
              }));
              navigation.navigate('AccountPage');
            }}
          >
            Save
          </Button>  
        </View> 

        

      {/* </KeyboardAvoidingView> */}
      </View>
    </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
 ...generalStyles
});

export default EditProfileScreen;
