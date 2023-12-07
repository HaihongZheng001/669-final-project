import { initializeApp } from 'firebase/app';
import { addDoc, updateDoc,setDoc, doc, getFirestore, collection, onSnapshot, getDocs, query, where, serverTimestamp, getDoc } from 'firebase/firestore';
// import { firebaseConfig } from '../Secrets';
import { ADD_USER, LOAD_USERS, UPDATE_USER, ADD_REVIEW, LOAD_COURSES, LOAD_INSTRUCTORS, LOAD_LOGIN_USER_REVIEWS, LOAD_COURSE_REVIEWS } from './Reducer';
import { app, db, auth } from '../firebase';
import { Firestore, arrayUnion } from 'firebase/firestore';




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

const addReview = (newReview) => {
  return async dispatch => {
    try {
      const docRef = await addDoc(collection(db, 'reviews'), newReview);
      const reviewWithId = { ...newReview, id: docRef.id };
      await updateDoc(doc(db, 'reviews', docRef.id), reviewWithId);

      // add id to user document
      const q = query(collection(db, 'users'), where('uid', '==', newReview.userUid));
      const querySnapshot = await getDocs(q);
      const userDoc = querySnapshot.docs[0];
      const userDocRef = doc(db, 'users', userDoc.id);
      await updateDoc(userDocRef, {
        myReviews: arrayUnion(docRef.id) // Add the review ID to the 'reviews' array in the user document
      });

      dispatch({
        type: ADD_REVIEW,
        payload: {
          review: reviewWithId
        }
      });
    } catch (error) {
      console.error("Error adding review to Firestore: ", error);
    }
  }

}

// !!add review as it's inside a subcollection of a course
// const addReview = (newReview) => {
//   // console.log('!!!!!!!',newReview)
//   const courseId = newReview.courseId;
//   // console.log('!!!', courseId)

//   return async dispatch => {
//     try {
//       const docRef = await addDoc(collection(db, 'courses', courseId, 'reviews'), newReview);
//       const reviewWithId = { ...newReview, id: docRef.id };
//       await updateDoc(doc(db, 'courses',courseId,'reviews',docRef.id), reviewWithId);

//       dispatch({
//         type: ADD_REVIEW,
//         payload: {
//           review: reviewWithId
//         }
//       });
//     } catch (error) {
//       console.error("Error adding review to Firestore: ", error);
//     }
//   }
// }


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

const loadCourses = () => {
  return async (dispatch) => {
    let querySnapshot = await getDocs(collection(db, 'courses'));
    let newCourses = querySnapshot.docs.map(docSnap => {
      return {
        ...docSnap.data(),
        // key: docSnap.id
      }
    });
    dispatch({
      type: LOAD_COURSES,
      payload: {
        newCourses: newCourses
      }
    });
  }
}

//? need to improve
const loadLoginUserReviews = (uid) => {
  return async (dispatch) => {
    const q = query(collection(db, 'users'), where('uid', '==', uid));
    const querySnapshot = await getDocs(q);
    const userDoc = querySnapshot.docs[0];
    const userDocRef = doc(db, 'users', userDoc.id);

    const userDocSnapshot = await getDoc(userDocRef);
    const reviewIds = userDocSnapshot.data().myReviews || [];
    // console.log('@@@@@!!reviewIds', reviewIds)

    const reviews = [];

    for (const reviewId of reviewIds) {
      const reviewDocRef = doc(db, 'reviews', reviewId); // 'reviews' is the collection name
      const reviewDocSnapshot = await getDoc(reviewDocRef);
      if (reviewDocSnapshot.exists()) {
        const reviewData = reviewDocSnapshot.data();
        reviews.push(reviewData);
      }
    }
    // console.log('@@@actions', reviews)

    // let querySnapshot = await getDocs(collection(db, 'reviews'));
    // let newReviews = querySnapshot.docs.map(docSnap => {
    //   return {
    //     ...docSnap.data(),
    //     // key: docSnap.id
    //   }
    // });
    
    dispatch({
      type: LOAD_LOGIN_USER_REVIEWS,
      payload: {
        loginUserReviews: reviews
      }
    });
  }
}

const loadCourseReviews = (courseId) => {
  
  return async (dispatch) => {
    console.log("Course ID:", courseId);

    const q = query(collection(db, 'reviews'), where('courseId', '==', courseId));
    const querySnapshot = await getDocs(q);
    const reviews = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    dispatch({
      type: LOAD_COURSE_REVIEWS,
      payload: {
        courseReviews: reviews
      }
    });
  }
}


// !!functions to load subcollection in courses
// const loadCourses = () => {
//   return async (dispatch) => {
//     let querySnapshot = await getDocs(collection(db, 'courses'));
//     let newCourses = await Promise.all(querySnapshot.docs.map(async (docSnap)=> {
//       const courseData = docSnap.data();
//       const reviewsSnapshot = await getDocs(collection(db, 'courses', docSnap.id, 'reviews'));
//       const reviews = reviewsSnapshot.docs.map(doc => doc.data());
//       return {
//          ...courseData, reviews
//         // ...docSnap.data(),
//         // key: docSnap.id
//       }
//     }));
//     dispatch({
//       type: LOAD_COURSES,
//       payload: {
//         courses: newCourses
//       }
//     });
//   }
// }

const loadInstructors = () => {
  return async (dispatch) => {
    let querySnapshot = await getDocs(collection(db, 'instructors'));
    let newInstructors = querySnapshot.docs.map(docSnap => {
      return {
        ...docSnap.data(),
        // key: docSnap.id
      }
    });
    dispatch({
      type: LOAD_INSTRUCTORS,
      payload: {
        newInstructors: newInstructors
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



export { addUser, updateUser, loadUsers, addReview, loadCourses, loadInstructors, loadLoginUserReviews, loadCourseReviews }