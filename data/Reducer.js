const ADD_USER = 'ADD_USER';
const LOAD_USERS = 'LOAD_USERS';
const UPDATE_USER = 'UPDATE_USER';
const LOAD_COURSES = 'LOAD_COURSES';
const LOAD_INSTRUCTORS = 'LOAD_INSTRUCTORS';
const ADD_REVIEW = 'ADD_REVIEW';
const LOAD_LOGIN_USER_REVIEWS = 'LOAD_LOGIN_USER_REVIEWS';
const LOAD_COURSE_REVIEWS = 'LOAD_COURSE_REVIEWS';


const initialState = {
  users: [],
  courses: [],
  instructors: [],
  reviews: [],
  loginUserReviews: [],
  courseReviews: []
}

const addUser = (state, newUser) => {
  let user = {
    ...newUser,
  }
  return {
    ...state, 
    users: [...state.users, user]
  };
}

const loadUsers = (state, users) => {
  return {
    ...state, 
    users: [...users]
  }
}

const loadCourses = (state, courses) => {
  return {
    ...state, 
    courses: [...courses]
  }
}

const loadLoginUserReviews = (state, loginUserReviews) => {
  return {
    ...state, 
    loginUserReviews: loginUserReviews
  }
}

const loadCourseReviews = (state, courseReviews) => {
  return {
    ...state, 
    courseReviews: courseReviews
  }
}

const loadInstructors = (state, instructors) => {
  return {
    ...state, 
    instructors: [...instructors]
  }
}

const updateUser = (state, userId, updatedUser) => {
  let newUser = {...updatedUser};
  return {
    ...state, 
    users: state.users.map(user=>user.id === userId ? newUser : user)
  };
}

const addReview = (state, newReview) => {
  let review = {
    ...newReview,
  }
  return {
    ...state, 
    reviews: [...state.reviews, review]
  };
}



//!!add review as subcollection of a course
// const addReview = (state, newReview) => {
//   // console.log('reducer!!! review', newReview)
//   const courseId = newReview.courseId;
//   // console.log('reducer???courseId', courseId)
//   const courseIndex = state.courses.findIndex(course => course.id === courseId);
//   // console.log('reducer???courseIndex', courseIndex)
//   // console.log('reducer???state.courses=', state.courses[1].reviews)
//   // const updatedReviews = [...state.courses[courseIndex].reviews, newReview];
//   // const updatedReviews = [...state.courses[courseIndex].reviews, newReview];

//   // const courseIndex = state.courses.findIndex(course => course.id === courseId);
//   if (courseIndex === -1) {
//     // Course not found, handle this case appropriately
//     return state;
//   }

//   // Create a new review array with the new review added
//   const updatedReviews = [...state.courses[courseIndex].reviews, newReview];

//   // Create a new updated course object
//   const updatedCourse = { ...state.courses[courseIndex], reviews: updatedReviews };

//   // Create a new array of courses with the updated course
//   const updatedCourses = [
//     ...state.courses.slice(0, courseIndex),
//     updatedCourse,
//     ...state.courses.slice(courseIndex + 1),
//   ];

//   // Return the updated state
//   return { ...state, courses: updatedCourses };
// }

const rootReducer = (state=initialState, action) => {
  switch (action.type) {
    case LOAD_USERS:
      return loadUsers(state, action.payload.newUsers);
    case ADD_USER:
      return addUser(state, action.payload.user);
    case UPDATE_USER:
      return updateUser(state, action.payload.id, action.payload.user);
    case LOAD_COURSES:
      return loadCourses(state, action.payload.newCourses);
    case LOAD_INSTRUCTORS:
      return loadInstructors(state, action.payload.newInstructors);
    case ADD_REVIEW:
      return addReview(state, action.payload.review);
    case LOAD_LOGIN_USER_REVIEWS:
      return loadLoginUserReviews(state, action.payload.loginUserReviews);
    case LOAD_COURSE_REVIEWS:
      return loadCourseReviews(state, action.payload.courseReviews)
    default:
      return state;
  }
}
export { rootReducer, ADD_USER, LOAD_USERS, UPDATE_USER, LOAD_COURSES, LOAD_INSTRUCTORS, ADD_REVIEW, LOAD_LOGIN_USER_REVIEWS, LOAD_COURSE_REVIEWS };