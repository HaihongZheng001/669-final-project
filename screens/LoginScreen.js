
import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, Keyboard, TouchableWithoutFeedback,Image, KeyboardAvoidingView } from 'react-native';
// import { Button } from '@rneui/themed';
import { useDispatch } from 'react-redux';
import { signIn, signUp, subscribeToAuthChanges } from '../AuthManager';
import { addUser } from '../data/Actions';
import logo from '../assets/logo2.png';
import { TextInput, Button } from 'react-native-paper';



function SigninBox({navigation}) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

  
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>

      <View style={styles.loginContainer}>
        <View style={styles.loginRow}>
          <Image source={logo} style={styles.logoImage}/>
        </View>
        <View style={styles.loginRow}>

          <View style={styles.loginInputContainer}>
            <TextInput 
              style={styles.loginInputBox}
              autoCapitalize='none'
              mode='outlined'
              label="Email"
              onChangeText={text=>setEmail(text)}
              value={email}
              outlineColor = '#E092DF'
              outlineStyle={{ borderRadius:'10%' }}
              activeOutlineColor='#D952D8'
            />
          </View>
        </View>
        <View style={styles.loginRow}>
          {/* <View style={styles.loginLabelContainer}>
            <Text style={styles.loginLabelText}>Password: </Text>
          </View> */}
          <View style={styles.loginInputContainer}>
            <TextInput 
              style={styles.loginInputBox}
              // placeholder='enter password' 
              // autoCapitalize='none'
              // spellCheck={false}
              mode='outlined'
              secureTextEntry={true}
              label="Password"
              onChangeText={text=>setPassword(text)}
              value={password}
              outlineColor = '#E092DF'
              activeOutlineColor='#D952D8'
              outlineStyle={{ borderRadius:'10%' }}

            />
          </View>
        </View>
        <View style={styles.buttonRowContainer}>
          <Button
            // onPress={() => {
            //   navigation.navigate("Home");
            // }}
            style={{ borderRadius: '10%', height: '31%', justifyContent: 'center', backgroundColor:'#5F32D1' }}
            mode={'contained'}
            width={280}
            labelStyle={{ fontSize: 20 }}
            // disabled={email != '' && password != '' ? false : true}
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
          <Image source={logo} style={styles.logoImage}/>
        </View>
        {/* <Text style={styles.loginHeaderText}>Sign Up</Text> */}
        <View style={styles.loginRow}>
          {/* <View style={styles.loginLabelContainer}>
            <Text style={styles.loginLabelText}>Name: </Text>
          </View> */}
          <View style={styles.loginInputContainer}>
            <TextInput 
              style={styles.loginInputBox}
              // placeholder='enter display name' 
              autoCapitalize="words"
              spellCheck={false}
              onChangeText={text=>setName(text)}
              value={name}
              label="Name"
              mode='outlined'
              outlineColor = '#E092DF'
              activeOutlineColor='#D952D8'
              outlineStyle={{ borderRadius:'10%' }}
            />
          </View>
        </View>
        <View style={styles.loginRow}>
          {/* <View style={styles.loginLabelContainer}>
            <Text style={styles.loginLabelText}>Email: </Text>
          </View> */}
          <View style={styles.loginInputContainer}>
            <TextInput 
              style={styles.loginInputBox}
              autoCapitalize='none'
              spellCheck={false}
              onChangeText={text=>setEmail(text)}
              value={email}
              label='Email'
              mode='outlined'
              outlineColor = '#E092DF'
              activeOutlineColor='#D952D8'
              outlineStyle={{ borderRadius:'10%' }}

            />
          </View>
        </View>
        {/* <KeyboardAvoidingView
           behavior='padding'
           keyboardVerticalOffset={200}
           style={styles.container}
        > */}
        <View style={styles.loginRow}>
          {/* <View style={styles.loginLabelContainer}>
            <Text style={styles.loginLabelText}>Password: </Text>
          </View> */}
          <View style={styles.loginInputContainer}>
            <TextInput 
              style={styles.loginInputBox}
              autoCapitalize='none'
              spellCheck={false}
              secureTextEntry={true}
              onChangeText={text=>setPassword(text)}
              value={password}
              label='Password'
              mode='outlined'
              outlineColor = '#E092DF'
              activeOutlineColor='#D952D8'
              outlineStyle={{ borderRadius:'10%' }}

            />
          </View>
        </View>
            {/* </KeyboardAvoidingView> */}
        <View style={styles.buttonRowContainer}>
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
            mode='contained'
            width={280}
            style={{ borderRadius: '10%', height: '30%', justifyContent: 'center', backgroundColor:'#5F32D1' }}
            labelStyle={{ fontSize: 16 }}
            
            // disabled={name !== '' && email !== '' && password !== '' ? false : true}
          >
            SIGN UP
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

        <View style={styles.modeSwitchContainer}>
            { loginMode ? 
            <Text>New user? 
                <Text  onPress={()=>{setLoginMode(!loginMode)}} style={{color: '#5F32D1', fontWeight:'bold'}}> Sign up </Text> 
                here
            </Text>
            :
            <Text>Returning user? 
                <Text 
                  style={{color: '#5F32D1', fontWeight:'bold'}}
                  onPress={()=>{setLoginMode(!loginMode)}} 
                > Sign in </Text> 
                here
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
      backgroundColor: '#FFFAFE',
      alignItems: 'center',
      // justifyContent: 'center',
      // backgroundColor:'pink',
    },
    logoImage: {
      width: 300,
      height: 168,
      marginBottom: '10%'
    },
    bodyContainer: {
      flex: 0.8,
      width: '80%',
      // justifyContent: 'center',
      // alignItems: 'center',

      // backgroundColor:'lightblue',
    },
    loginContainer: {
      flex: 1,
      justifyContent: 'flex-start',
      alignItems: 'center',
      width: '100%',
      paddingTop: '30%',
      paddingBottom: '10%',
      // backgroundColor:'green'
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
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      padding: '3%',
      // backgroundColor: 'orange'
    },
    // loginLabelContainer: {
    //   flex: 0.3,
    //   justifyContent: 'center',
    //   alignItems: 'flex-end'
    // },
    // loginLabelText: {
    //   fontSize: 14
    // },
    loginInputContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      // flexSize: 10,
      // backgroundColor:'blue'
    },
    loginInputBox: {
      width: '100%',
      // borderColor: 'pink',
      // borderWidth: 1,
      // fontSize: 14,
      // padding: '2%'
    },
    modeSwitchContainer:{
      flex: 0.2,
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      // backgroundColor: 'yellow'
    },
    loginButtonRow: {
      width: '100%',
      justifyContent: 'center', 
      alignItems: 'center',
    },
    buttonRowContainer: {
      marginTop:'10%',
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