
import { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, Keyboard, TouchableWithoutFeedback,Image, KeyboardAvoidingView } from 'react-native';
import { Button } from '@rneui/themed';
import { useDispatch } from 'react-redux';
import { signIn, signUp, subscribeToAuthChanges } from '../AuthManager';
import { addUser } from '../data/Actions';
import logo from '../assets/logo33.png';



function SigninBox({navigation}) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
  
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>

      <View style={styles.loginContainer}>
        <View style={styles.loginRow}>
        <Image source={logo} style={{ width: 300, height: 200 }}/>
        </View>
        <Text style={styles.loginHeaderText}>Sign In</Text>
        <View style={styles.loginRow}>
          <View style={styles.loginLabelContainer}>
            <Text style={styles.loginLabelText}>Email: </Text>
          </View>
          <View style={styles.loginInputContainer}>
            <TextInput 
              style={styles.loginInputBox}
              placeholder='enter email address' 
              autoCapitalize='none'
              spellCheck={false}
              onChangeText={text=>setEmail(text)}
              value={email}
            />
          </View>
        </View>
        <View style={styles.loginRow}>
          <View style={styles.loginLabelContainer}>
            <Text style={styles.loginLabelText}>Password: </Text>
          </View>
          <View style={styles.loginInputContainer}>
            <TextInput 
              style={styles.loginInputBox}
              placeholder='enter password' 
              autoCapitalize='none'
              spellCheck={false}
              secureTextEntry={true}
              onChangeText={text=>setPassword(text)}
              value={password}
            />
          </View>
        </View>
        <View style={styles.loginRow}>
          <Button
            // onPress={() => {
            //   navigation.navigate("Home");
            // }}
            onPress={async () => {
                try {
                    await signIn(email, password);
                    // navigation.navigate('Home');
                } catch(error) {
                    Alert.alert("Sign In Error", error.message,[{ text: "OK" }])
                }
            }}
          >
            Sign In
          </Button>  
        </View>
      </View>
      </TouchableWithoutFeedback>
    );
  }



function SignupBox({navigation}) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const dispatch = useDispatch(); // make sure it's in SignupBox()!!!
  

  
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.loginContainer}>
         <View style={styles.loginRow}>
          <Image source={logo} style={{ width: 300, height: 200 }}/>
        </View>
        <Text style={styles.loginHeaderText}>Sign Up</Text>
        <View style={styles.loginRow}>
          <View style={styles.loginLabelContainer}>
            <Text style={styles.loginLabelText}>Name: </Text>
          </View>
          <View style={styles.loginInputContainer}>
            <TextInput 
              style={styles.loginInputBox}
              placeholder='enter display name' 
              autoCapitalize='none'
              spellCheck={false}
              onChangeText={text=>setName(text)}
              value={name}
            />
          </View>
        </View>
        <View style={styles.loginRow}>
          <View style={styles.loginLabelContainer}>
            <Text style={styles.loginLabelText}>Email: </Text>
          </View>
          <View style={styles.loginInputContainer}>
            <TextInput 
              style={styles.loginInputBox}
              placeholder='enter email address' 
              autoCapitalize='none'
              spellCheck={false}
              onChangeText={text=>setEmail(text)}
              value={email}
            />
          </View>
        </View>
        {/* <KeyboardAvoidingView
           behavior='padding'
           keyboardVerticalOffset={200}
           style={styles.container}
        > */}
        <View style={styles.loginRow}>
          <View style={styles.loginLabelContainer}>
            <Text style={styles.loginLabelText}>Password: </Text>
          </View>
          <View style={styles.loginInputContainer}>
            <TextInput 
              style={styles.loginInputBox}
              placeholder='enter password' 
              autoCapitalize='none'
              spellCheck={false}
              secureTextEntry={true}
              onChangeText={text=>setPassword(text)}
              value={password}
            />
          </View>
        </View>
                {/* </KeyboardAvoidingView> */}

        <View style={styles.loginRow}>
          <Button
            onPress={async () => {
              try {
                const newUser = await signUp(name, email, password);
                const uid = newUser.uid
                dispatch(addUser({name, email, uid}));
                navigation.navigate('Account');
              } catch(error) {
                Alert.alert("Sign Up Error", error.message, [{ text: "OK" }])
              }
            }}
          >
            Sign Up
          </Button>  
        </View>
      </View>
      </TouchableWithoutFeedback>
    );
  }

function LoginScreen({navigation}) {
  

  const [loginMode, setLoginMode] = useState(true);




  useEffect(()=> {
    subscribeToAuthChanges(navigation);
  }, []);


  return (
    <View style={styles.container}>
      <View style={styles.bodyContainer}>
        {/* <SigninBox navigation={navigation}/> */}

        {loginMode?
            <SigninBox navigation={navigation}/>
            :
            <SignupBox navigation={navigation}/>
        }
      </View>

        <View styles={styles.modeSwitchContainer}>
            { loginMode ? 
            <Text style={{marginBottom: '5%'}}>New user? 
                <Text 
                onPress={()=>{setLoginMode(!loginMode)}} 
                style={{color: 'blue'}}> Sign up </Text> 
                instead!
            </Text>
            :
            <Text>Returning user? 
                <Text 
                onPress={()=>{setLoginMode(!loginMode)}} 
                style={{color: 'blue', marginTop: '10%'}}> Sign in </Text> 
                instead!
            </Text>
            }

            {/* <Button
                title='Just go in anyway'
                onPress={()=>navigation.navigate('Home')}
             /> */}
        </View>
    </View>
  );
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      // justifyContent: 'center',
      // backgroundColor:'pink'
    },
    bodyContainer: {
      flex: 0.8,
      justifyContent: 'center',
      alignItems: 'center',
      // backgroundColor:'lightblue',
    },
    loginContainer: {
      flex: 1,
      justifyContent: 'flex-start',
      alignItems: 'center',
      width: '100%',
      paddingTop: '30%',
      paddingBottom: '10%',
    },
    loginHeader: {
      width: '100%',
      padding: '3%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    loginHeaderText: {
      fontSize: 24,
      color: 'black',
      paddingBottom: '5%'
    },
    loginRow: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
      width: '100%',
      padding: '3%'
    },
    loginLabelContainer: {
      flex: 0.3,
      justifyContent: 'center',
      alignItems: 'flex-end'
    },
    loginLabelText: {
      fontSize: 18
    },
    loginInputContainer: {
      flex: 0.5,
      justifyContent: 'center',
      alignItems: 'flex-start',
      width: '100%'
    },
    loginInputBox: {
      width: '100%',
      borderColor: 'lightgray',
      borderWidth: 1,
      borderRadius: 6,
      fontSize: 18,
      padding: '2%'
    },
    modeSwitchContainer:{
      flex: 0.2,
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      backgroundColor: 'pink'
    },
    loginButtonRow: {
      width: '100%',
      justifyContent: 'center', 
      alignItems: 'center'
    },
    listContainer: {
      flex: 0.7, 
      backgroundColor: '#ccc',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%', 
    },

  });
  export default LoginScreen;