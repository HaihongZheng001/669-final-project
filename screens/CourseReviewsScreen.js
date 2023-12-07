import React, {useEffect, useState} from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { loadCourseReviews, loadInstructors, loadUsers } from '../data/Actions';
import { Header } from '../components/Header';
import { generalStyles } from '../styles/Styles';
import { Button } from '@rneui/themed';
import StarRating from 'react-native-star-rating-widget';

// import { updateSuggestions, onSuggestionPress } from './dropdownUtils.js';
// import { MultipleSelectList } from 'react-native-dropdown-select-list';
// import { IndexPath, Layout, Select, SelectItem } from '@ui-kitten/components';




function CourseReviewsScreen(props) {
  const { navigation, route } = props;
  const { courseId } = route.params;
  const [selectedTimes, setSelectedTimes] = React.useState([]);
  const [rating, setRating] = useState(4);

  const data = [
    {key:'1', value:'Mobiles', disabled:true},
    {key:'2', value:'Appliances'},
    {key:'3', value:'Cameras'},
    {key:'4', value:'Computers', disabled:true},
    {key:'5', value:'Vegetables'},
    {key:'6', value:'Diary Products'},
    {key:'7', value:'Drinks'},
]



  const initCourseReviews = useSelector(state => {
    console.log('==course Reviews from state', state.courseReviews)
    return state.courseReviews
  })

  const initUsers = useSelector(state => state.users)

  const initInstructors = useSelector(state => {
    // console.log('!!instructor', state.instructors)
    return state.instructors
  })


  
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadCourseReviews(courseId))
    dispatch(loadUsers())
    dispatch(loadInstructors())

  }, [])

  const courses = useSelector(state => {
    return state.courses
  })

  const courseObj = courses.filter(course => course.id === courseId)[0]

  

  return (
    <View style={styles.container}>
      <Header navigation={navigation} title={'Course Reviews'} showBackButton={true} />
      
      <View style={styles.body}>
        <Text style={styles.boldLabel}>{courseObj.name}</Text>
        <Text style={{marginTop: '5%', marginBottom:'4%'}}>Course Rating: </Text>
        <View style={{backgroundColor: 'lightgrey', width: '56%', padding: '2%', borderRadius: '30%'}}>
          <StarRating
            rating={rating}
            onChange={setRating}
            starSize={30}
            starStyle	={{ marginLeft: 0}}
          />
        </View>

        <View style={styles.buttonContainer}>
          <Button
            onPress={() =>{
              // console.log('!courseObj now', courseObj)
              navigation.navigate('EditReview', { courseObj: courseObj })
            }}
          >
            Write a Review
          </Button>
        </View>

        <Text style={[styles.boldLabel, {marginBottom:'5%'}]}>Review Details ({initCourseReviews && initCourseReviews.length > 0 && initCourseReviews.length})</Text>


        <FlatList
            data={initCourseReviews} // Provide the data source
            renderItem={({ item }) => (
              <View style={styles.reviewCardContainer}>
                  <View style={styles.userContainer}>
                    <Text style={styles.boldLabel}>{initUsers && initUsers.length > 0 && initUsers.filter(user => user.uid === item.userUid)[0].name}</Text>
                    {/* {console.log('!! initUsers', initUsers)} */}
                  </View>

                  <View style={styles.courseInfoContainer}>
                    <Text>{item.term} {item.year}   {initInstructors && initInstructors.length > 0 && initInstructors.filter(ins => ins.id === item.instructorId)[0].name}   Rating: {item.rating}/5</Text>
                    {/* {console.log('!!initInstructors', initInstructors)} */}
                  </View>

                <View style={styles.reviewContentContainer}>
                  <Text>{item.reviewContent}</Text>
                </View>

              </View>
            )}    
            keyExtractor={(item) => item.id} // Provide a unique key for each item
        />


      </View>

      

    </View>
  );
}

const styles = StyleSheet.create({
  ...generalStyles,
  reviewCardContainer: {
    marginBottom:'2%',
    marginTop:'2%',
    backgroundColor: '#FAF6F0',
    padding:'4%',
    paddingTop:'6%',
    paddingBottom:'6%'
  },
  userContainer: {
    // backgroundColor: 'pink',
    paddingBottom:'2%',
    marginBottom:'2%',

  },
  courseInfoContainer: {
    // backgroundColor: 'yellow',
    paddingBottom:'2%',
    marginBottom:'2%',

  },
  reviewContentContainer: {
    // backgroundColor: 'red',
    paddingBottom:'2%'
  },
  boldLabel: {
    fontWeight: 'bold'
  },
  selectContainer: {
    marginTop: '10%',
    marginBottom:'10%',
    zIndex: 20
  },
  buttonContainer: {
    marginTop:'10%',
    marginBottom:'10%'
  }
});

export default CourseReviewsScreen;
