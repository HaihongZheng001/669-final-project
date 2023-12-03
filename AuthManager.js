
// in AuthManager.js
import { getApps, initializeApp } from 'firebase/app';
import { firebaseConfig } from './Secrets';

import { getAuth, signInWithEmailAndPassword,
  createUserWithEmailAndPassword, 
  updateProfile,
  signOut as fbSignOut, 
  initializeAuth, 
  getReactNativePersistence,
  onAuthStateChanged,
} from 'firebase/auth';

import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { app, db, auth } from './firebase';



// let app, auth;
// // this guards against initializing more than one "App"
// const apps = getApps();
// if (apps.length == 0) { 
//   app = initializeApp(firebaseConfig);
// } else {
//   app = apps[0];
// }

// // auth = getAuth(app);
// try {
//   auth = initializeAuth(app, {
//     persistence: getReactNativePersistence(ReactNativeAsyncStorage)
//   });
// } catch (error) {
//   auth = getAuth(app); // if auth already initialized
// }


const signIn = async (email, password) => {
  await signInWithEmailAndPassword(auth, email, password);

}

const signOut = async () => {
  await fbSignOut(auth);
}

const signUp = async (name, email, password) => {
    const userCred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCred.user, {name: name});
    return userCred.user;
}

const getAuthUser = () => {
  return auth.currentUser;
}

let unsubscribeFromAuthChanges = undefined;

const subscribeToAuthChanges = (navigation) => {
  if (unsubscribeFromAuthChanges) {
      unsubscribeFromAuthChanges();
  }
  unsubscribeFromAuthChanges =  onAuthStateChanged(auth, (user) => {
      if (user) {
        // navigation.navigate('MainApp', { 
        //   screen: 'Home', 
        //   params: { 
        //     screen: 'HomePage',
        //   }
        // });
          navigation.navigate('MainApp', { 
            screen: 'Home', 
            params: { 
              screen: 'HomePage',
              params: {
                email: user.email,
              }
            }
          });
      } else {
          // console.log('user is signed out!');
          navigation.navigate('Login');
      }
  })
}

export { signIn, signOut, signUp, getAuthUser, subscribeToAuthChanges }