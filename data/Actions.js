import { initializeApp } from 'firebase/app';
import { addDoc, updateDoc,setDoc, doc, getFirestore, collection, onSnapshot } from 'firebase/firestore';
// import { firebaseConfig } from '../Secrets';
import { ADD_USER, LOAD_USERS, UPDATE_USER, ADD_REVIEW } from './Reducer';
import { getDocs } from 'firebase/firestore';
import { app, db, auth } from '../firebase';



// const app = initializeApp(firebaseConfig);
// const db = getFirestore(app);

// let snapshotUnsubsribe = undefined;

// const subscribeToUserUpdates = () => {
//     if (snapshotUnsubsribe) {
//       snapshotUnsubsribe();
//     }
//     return (dispatch) => {
//       snapshotUnsubsribe = onSnapshot(collection(db, 'users'), usersSnapshot => {
//         const updatedUsers = usersSnapshot.docs.map(uSnap => {
//           console.log(uSnap.data());
//           return uSnap.data(); // already has key?
//         });
//         dispatch({
//           type: LOAD_USERS,
//           payload: {
//             users: updatedUsers
//           }
//         });
//       });
//     }
//   }

// const addUser = (user) => {
//   return async (dispatch) => {
//     // TODO: add to firestore
//     // dispatch({
//     //   type: ADD_USER,
//     //   payload: {
//     //     user: {...user}
//     //   }
//     // });

//    userToAdd = {
//     name: user.name,
//     email: user.email,
//     key: user.uid
//   };
//   await setDoc(doc(db, 'users', user.uid), userToAdd);

//     // dispatch({
//     //     type: ADD_USER,
//     //     payload: {
//     //     user: {...userToAdd}
//     //     }
//     // });
//   }
// }

const addUser = (newUser) => {
  return async dispatch => {
    try {
      const docRef = await addDoc(collection(db, 'users'), newUser);
      const userWithId = { ...newUser, id: docRef.id };
      await updateDoc(doc(db, 'users', docRef.id), userWithId);

      dispatch({
        type: ADD_USER,
        payload: {
          user: userWithId
        }
      });
    } catch (error) {
      console.error("Error adding user to Firestore: ", error);
    }
  }
}



const loadUsers = () => {
  return async (dispatch) => {
    let querySnapshot = await getDocs(collection(db, 'users'));
    let newUsers = querySnapshot.docs.map(docSnap => {
      return {
        ...docSnap.data(),
        // key: docSnap.id
      }
    });
    dispatch({
      type: LOAD_USERS,
      payload: {
        newUsers: newUsers
      }
    });
  }
}


const updateUser = (updatedUser) => {
  // return async dispatch => {
  //   await updateDoc(doc(db, 'users', updatedUser.id), updatedUser);
  //   dispatch( {
  //       type: UPDATE_USER,
  //       payload: {
  //         id: updatedUser.id,
  //         user: {...updatedUser}
  //       }
  //     }
  //   );
  // }
  return async dispatch => {
    try {
      if (!updatedUser.id) {
        console.error("User ID is undefined, cannot update user");
        return;
      }

      await updateDoc(doc(db, 'users', updatedUser.id), updatedUser);
      dispatch({
        type: UPDATE_USER,
        payload: {
          id: updatedUser.id,
          user: { ...updatedUser }
        }
      });
    } catch (error) {
      console.error("Error updating user:", error);
      // Handle the error appropriately
    }
  };
}
export { addUser, updateUser, loadUsers }