
// data/Actions.js

import { initializeApp } from 'firebase/app';
import { setDoc, doc, getFirestore, collection, onSnapshot } from 'firebase/firestore';
import { firebaseConfig } from '../Secrets';
import { ADD_USER, LOAD_USERS } from './Reducer';


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


let snapshotUnsubsribe = undefined;

const subscribeToUserUpdates = () => {
    if (snapshotUnsubsribe) {
      snapshotUnsubsribe();
    }
    return (dispatch) => {
      snapshotUnsubsribe = onSnapshot(collection(db, 'users'), usersSnapshot => {
        const updatedUsers = usersSnapshot.docs.map(uSnap => {
          console.log(uSnap.data());
          return uSnap.data(); // already has key?
        });
        dispatch({
          type: LOAD_USERS,
          payload: {
            users: updatedUsers
          }
        });
      });
    }
  }

const addUser = (user) => {
  return async (dispatch) => {
    // TODO: add to firestore
    // dispatch({
    //   type: ADD_USER,
    //   payload: {
    //     user: {...user}
    //   }
    // });

   userToAdd = {
    displayName: user.displayName,
    email: user.email,
    key: user.uid
  };
  await setDoc(doc(db, 'users', user.uid), userToAdd);

    // dispatch({
    //     type: ADD_USER,
    //     payload: {
    //     user: {...userToAdd}
    //     }
    // });
  }
}
export { addUser, subscribeToUserUpdates }