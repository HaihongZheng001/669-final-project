
import { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Alert } from 'react-native';
import { Button } from '@rneui/themed';
import { useDispatch } from 'react-redux';
import { signIn, signUp, subscribeToAuthChanges } from '../AuthManager';
import { addUser } from '../data/Actions';


function SigninBox({navigation}) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setComfirmPassword] = useState('');

  
    return (
      <View style={styles.loginContainer}>
        <Text style={styles.loginHeaderText}>RateMyCouses</Text>
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
    );
  }



function SignupBox({navigation}) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [displayName, setDisplayName] = useState('');
    const dispatch = useDispatch(); // make sure it's in SignupBox()!!!

  
    return (
      <View style={styles.loginContainer}>
        <Text style={styles.loginHeaderText}>Create an account</Text>
        <View style={styles.loginRow}>
          <View style={styles.loginLabelContainer}>
            <Text style={styles.loginLabelText}>Username: </Text>
          </View>
          <View style={styles.loginInputContainer}>
            <TextInput 
              style={styles.loginInputBox}
              placeholder='enter display name' 
              autoCapitalize='none'
              spellCheck={false}
              onChangeText={text=>setDisplayName(text)}
              value={displayName}
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
            onPress={async () => {
              try {
                const newUser = await signUp(displayName, email
                    , password);
                dispatch(addUser(newUser));
                // navigation.navigate('Home');
              } catch(error) {
                Alert.alert("Sign Up Error", error.message, [{ text: "OK" }])
              }
            }}
          >
            Sign Up
          </Button>  
        </View>
      </View>
    );
  }

function LoginScreen({navigation, route}) {

  const [loginMode, setLoginMode] = useState(true);

  useEffect(()=> {
    subscribeToAuthChanges(navigation);
  }, []);


  useEffect(()=>{
    console.log("route",route)
  }
  ,[navigation])


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
            <Text>Don't have an account?
                <Text 
                onPress={()=>{setLoginMode(!loginMode)}} 
                style={{color: 'blue'}}> Sign up here</Text> 
            </Text>
            :
            <Text>Already have an account? 
                <Text 
                onPress={()=>{setLoginMode(!loginMode)}} 
                style={{color: 'blue'}}> Login here </Text> 
            </Text>
            }
        </View>
    </View>
  );
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    bodyContainer: {
      flex: 0.5,
      justifyContent: 'center',
      alignItems: 'center',
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