import { initializeApp } from 'firebase/app';
import { addDoc, updateDoc,setDoc, doc, getFirestore, collection, onSnapshot, getDocs, query, where, serverTimestamp, getDoc, deleteDoc } from 'firebase/firestore';
// import { firebaseConfig } from '../Secrets';
import { ADD_USER, LOAD_USERS, UPDATE_USER, ADD_REVIEW, LOAD_COURSES, LOAD_INSTRUCTORS,UPDATE_REVIEW, DELETE_REVIEW, LOAD_REVIEWS } from './Reducer';
import { app, db, auth } from '../firebase';
import { Firestore, arrayUnion } from 'firebase/firestore';

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

const loadReviews = () => {
  return async (dispatch) => {
    let querySnapshot = await getDocs(collection(db, 'reviews'));
    let newReviews = querySnapshot.docs.map(docSnap => {
      return {
        ...docSnap.data(),
        // key: docSnap.id
      }
    });
    dispatch({
      type: LOAD_REVIEWS,
      payload: {
        newReviews: newReviews
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
// const loadLoginUserReviews = (uid) => {
//   return async (dispatch) => {
//     const q = query(collection(db, 'users'), where('uid', '==', uid));
//     const querySnapshot = await getDocs(q);
//     const userDoc = querySnapshot.docs[0];
//     const userDocRef = doc(db, 'users', userDoc.id);

//     const userDocSnapshot = await getDoc(userDocRef);
//     const reviewIds = userDocSnapshot.data().myReviews || [];
//     // console.log('@@@@@!!reviewIds', reviewIds)

//     const reviews = [];

//     for (const reviewId of reviewIds) {
//       const reviewDocRef = doc(db, 'reviews', reviewId); // 'reviews' is the collection name
//       const reviewDocSnapshot = await getDoc(reviewDocRef);
//       if (reviewDocSnapshot.exists()) {
//         const reviewData = reviewDocSnapshot.data();
//         reviews.push(reviewData);
//       }
//     }

//     // console.log('@@@actions', reviews)

//     // let querySnapshot = await getDocs(collection(db, 'reviews'));
//     // let newReviews = querySnapshot.docs.map(docSnap => {
//     //   return {
//     //     ...docSnap.data(),
//     //     // key: docSnap.id
//     //   }
//     // });
    
//     dispatch({
//       type: LOAD_LOGIN_USER_REVIEWS,
//       payload: {
//         loginUserReviews: reviews
//       }
//     });
//   }
// }

// const loadCourseReviews = (courseId) => {
  
//   return async (dispatch) => {
//     console.log("Course ID:", courseId);

//     const q = query(collection(db, 'reviews'), where('courseId', '==', courseId));
//     const querySnapshot = await getDocs(q);
//     const reviews = querySnapshot.docs.map(doc => ({
//       id: doc.id,
//       ...doc.data()
//     }));
    
//     dispatch({
//       type: LOAD_COURSE_REVIEWS,
//       payload: {
//         courseReviews: reviews
//       }
//     });
//   }
// }


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

const updateReview = (updatedReview) => {
  return async dispatch => {
    try {
      if (!updatedReview.id) {
        console.error("Review ID is undefined, cannot update review");
        return;
      }

      await updateDoc(doc(db, 'reviews', updatedReview.id), updatedReview);
      dispatch({
        type: UPDATE_REVIEW,
        payload: {
          id: updatedReview.id,
          user: { ...updatedReview }
        }
      });
    } catch (error) {
      console.error("Error updating review:", error);
      // Handle the error appropriately
    }
  };
}



const deleteReview = (reviewObj) => {
  return async (dispatch, getState) => {
    let users = getState().users;
    // console.log('get users', users)
    let userId = users.find(u => u.uid === reviewObj.userUid).id
    console.log('heihei!')
    console.log('get user ID', userId)

    if (users) {
      users.forEach(u => {
        if (u && u.myReviews) {
          u.myReviews.forEach(async r => {
            // console.log('my reviews!!', u.myReviews)
            console.log('each review id!!', r)
            console.log('deleted review obj id!!', reviewObj.id)

            if (r === reviewObj.id) {
              console.log(`log r & review.id, ${r} and ${reviewObj.id}`)
              let newU = {...u, myReviews: u.myReviews.filter(r => r !== reviewObj.id)};
              console.log('new User Obj!!!', newU)
              await updateDoc(doc(db, 'users', userId), newU);
              console.log('delete from users myReviews')
            }
          });
        }
     
    })}
    await deleteDoc(doc(db, 'reviews', reviewObj.id));
    console.log('deleted from firebase review:', reviewObj.id);
    dispatch({
      type: DELETE_REVIEW,
      payload: {
        review: reviewObj
      }
    })
  }
}



export { addUser, updateUser, loadUsers, addReview, loadCourses, loadInstructors, updateReview, deleteReview, loadReviews }