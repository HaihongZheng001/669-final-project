import React, {useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { loadInstructors, loadUsers, loadReviews } from '../data/Actions';
import { Header } from '../components/Header';
import { generalStyles } from '../styles/Styles';
import StarRating from 'react-native-star-rating-widget';
import { Button } from 'react-native-paper';
import { Skeleton } from '@rneui/themed';
import { FontAwesome } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import RBSheet from "react-native-raw-bottom-sheet";
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Checkbox } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
// import { updateSuggestions, onSuggestionPress } from './dropdownUtils.js';
// import { MultipleSelectList } from 'react-native-dropdown-select-list';
// import { IndexPath, Layout, Select, SelectItem } from '@ui-kitten/components';

function CourseReviewsScreen(props) {
  const { navigation, route } = props;
  const { courseId, isFiltered, checkedInstructors, checkedRatings, checkedTimes, sortingLogic } = route.params || {};

  const [selectedTimes, setSelectedTimes] = useState([]);
  const [initCourseReviews, setInitCourseReviews] = useState([]); 
  const [userFilteredReviews, setUserFilteredReviews] = useState([])
  const [rating, setRating] = useState(0);
  const [timeFilterOptions, setTimeFilterOptions] = useState([]);
  const [ratingFilterOptions, setRatingFilterOptions] = useState([])
  const [instructorFilterOptions, setInstructorFilterOptions] = useState([]);
  const [ sortingChoice, setSortingChoice ] = useState('New to Old')


  const initUsers = useSelector(state => state.users)
  const reviews = useSelector(state => state.reviews)
  const initInstructors = useSelector(state =>  state.instructors)

  const getUserFilteredReviews = () => {
    if (initCourseReviews && checkedRatings && checkedTimes && checkedTimes.length > 0 && checkedInstructors && checkedInstructors.length > 0 ) {
      // console.log('!!checked times', checkedTimes)
      // console.log('checkedRatings', checkedRatings)
      const checkedInstructorIds = checkedInstructors.filter(item => item.isChecked).map(ins => ins.id)
      const checkedRatingsNew = checkedRatings.filter(item => item.isChecked).map(r => r.rating)
      const checkedYear = checkedTimes.filter(item => item.isChecked).map(t => t.year)
      const checkedTerm = checkedTimes.filter(item => item.isChecked).map(t => t.term)
      // console.log('checkedInstructorIds', checkedInstructorIds)
      // console.log('checked ratings', checkedRatings)
      // console.log('checkedYear', checkedYear)
      // console.log('checkedTerm', checkedTerm)
      // const checkedReviews = initCourseReviews.filter(review => checkedInstructorIds.includes(review.instructorId) && checkedRatings.includes(review.rating) && checkedTerm.includes(review.term) && checkedYear.includes(review.year))
      // console.log(initCourseReviews)

      const checkedReviews = initCourseReviews.filter(review => checkedTerm.includes(review.term) && checkedYear.includes(review.year) && checkedInstructorIds.includes(review.instructorId) && checkedRatingsNew.includes(review.rating))
      // console.log('checked reviews', checkedReviews.length)
      setUserFilteredReviews(checkedReviews)
    }
  }

  const getTimeFilterOptions = () => {
    if (initCourseReviews) {
      let timeStrList = [];
      initCourseReviews.map(reviewObj => {
        const timeStr = reviewObj.term + ' ' + reviewObj.year
        if (!timeStrList.includes(timeStr)) {
          timeStrList.push(timeStr)
        }
      })
      const result = timeStrList.map((str, index) => { 
        const year = str.split(' ')[1]
        const term = str.split(' ')[0]
        return ({ isChecked: true, time: str,  year: year, term: term, id:index }) 
      })
      // console.log('times!!!', result)
      return result
      // setTimeFilterOptions(result)
    }
  }

  const getRatingFilterOptions = () => {
    if (initCourseReviews) {
      let ratingList = []
      initCourseReviews.map(reviewObj => {
        if (!ratingList.includes(reviewObj.rating)) {
          ratingList.push(reviewObj.rating)
          // console.log('!!list', ratingList)
        }
      })
      // console.log('rating list', ratingList)
      const result = ratingList.map((r, index) => ({ rating: r, id:index, isChecked: true }))
      // console.log('result rating!!!!!~~~~##', result)
      return result
      // setRatingFilterOptions(result)
    }

  }

  const getInstructorFilterOptions = () => {
    if (initCourseReviews && initCourseReviews.length > 0 && initInstructors && initInstructors.length > 0)  {
      console.log('!!!!###ini!review', initCourseReviews)
      let idList = [];
      initCourseReviews.map(reviewObj => {
        if (!idList.includes(reviewObj.instructorId)) {
          idList.push(reviewObj.instructorId)
        }
      })
      console.log('idList!!!!', idList)
      const result = initInstructors.filter(ins => idList.includes(ins.id)).map(obj=> ({ id: obj.id, name: obj.name, isChecked: true }))
      return result
      // setInstructorFilterOptions(result)
    }
  }
  


  const dispatch = useDispatch();

  useEffect(() => {
    // dispatch(loadCourseReviews(courseId))
    dispatch(loadUsers())
    dispatch(loadInstructors())
    dispatch(loadReviews())

  }, [dispatch])



  useEffect(() => {
    const filteredReviews = reviews.filter(review => review.courseId === courseId)
    console.log('checing reviews', reviews)
    console.log('checing filtered reviews', filteredReviews)
    getCourseRating(initCourseReviews)


    if (filteredReviews && filteredReviews.length > 0) {
      console.log('setting filterz!!!!')
      setInitCourseReviews(filteredReviews)
      // getCourseRating(filteredReviews)
    }
 
    console.log('rendering!!!!!')
  }, [reviews])

  useEffect(() => {
    console.log('!@@@@haha')
    const iResult = getInstructorFilterOptions(initInstructors)
    console.log('iresult', iResult)
    const tResult = getTimeFilterOptions(reviews)
    const rResult = getRatingFilterOptions(reviews)
    setRatingFilterOptions(rResult)
    setTimeFilterOptions(tResult)
    setInstructorFilterOptions(iResult)
  }, [reviews, initInstructors])



  const courses = useSelector(state => {
    return state.courses
  })

  const courseObj = courses.filter(course => course.id === courseId)[0]

  const getCourseRating = (reviews) => {
    let sum = 0;
    for (let i = 0; i < reviews.length; i++) {
        sum += parseInt(reviews[i].rating, 10);
    }
    const averageRating = sum / reviews.length;
    setRating(averageRating)
  }


    // initCourseReviews ? getTimeFilterOptions():null

  // initCourseReviews && initInstructors ? getInstructorFilterOptions() : null



  const sortReviews = (reviewsToSort) => {
    let result = [...reviewsToSort];
    let curLogic = sortingLogic || sortingChoice
    const termOrder = { 'Winter': 1, 'Spring': 2, 'Summer': 3, 'Fall': 4 };

    const sortByYearAndTerm = (a, b, isDescending = false) => {
      const yearA = parseInt(a.year, 10);
      const yearB = parseInt(b.year, 10);

      if (yearA !== yearB) {
        return isDescending ? yearB - yearA : yearA - yearB;
      }

      // If years are the same, compare terms
      return isDescending ? termOrder[b.term] - termOrder[a.term] : termOrder[a.term] - termOrder[b.term];
    };

    if (curLogic === 'New to Old') {
      result.sort((a, b) => sortByYearAndTerm(a, b, true));
    } else if (curLogic === 'Old to New') {
      result.sort((a, b) => sortByYearAndTerm(a, b));
    } else if (curLogic === 'High to Low') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (curLogic === 'Low to High') {
      result.sort((a, b) => a.rating - b.rating);
    }

    return result;
  }


  useEffect(() => {
    if (sortingLogic) {
      setSortingChoice(sortingLogic)
    }
    if (isFiltered && checkedInstructors && checkedRatings && checkedTimes) {
      console.log('seting!!!!!!!')
      setInstructorFilterOptions(checkedInstructors);
      setTimeFilterOptions(checkedTimes)
      setRatingFilterOptions(checkedRatings)
      getUserFilteredReviews(checkedInstructors, checkedRatings, checkedTimes)
    }
    if (!isFiltered) {
      setInitCourseReviews(prev => sortReviews(prev))
    } else {
      setUserFilteredReviews(prev => sortReviews(prev))
    }
  }, [isFiltered, sortingLogic])
  

  return (
    <View style={styles.container}>
     <Header navigation={navigation} title={'Course Reviews'} showBackButton={true} />
      
     {courseObj && initCourseReviews ? (
     <>
      <View style={styles.body}>
          <Text style={styles.boldLabel}>{courseObj.name}</Text>
          <View style={{ flexDirection:'row', alignItems:'center', marginTop:'2%'}}>
            <Text style={{marginTop: '5%', marginBottom:'4%',marginRight:'2%', color: '#4C338F', fontWeight:'bold' }}>Rating: </Text>
        
            <StarRating
              rating={rating}
              onChange={() => {}}
              starSize={24}
              color='#FFCF00'
              starStyle	={{ marginLeft: 0}}
            />
            <Text style={{marginTop: '5%', marginBottom:'4%', color: '#4C338F', fontWeight:'bold', marginLeft:'2%' }}>{rating ? `${Math.round(rating * 10 )/ 10} / 5` : 'N/A'}</Text>
          </View>

          <View style={styles.buttonContainer}>
            <Button
              style={{ borderRadius: '6%', justifyContent: 'center', width:'60%', backgroundColor:'#5F32D1' }}
              mode={'contained'}
              labelStyle={{ fontSize: 14 }}
              onPress={() =>{
                // console.log('!courseObj now', courseObj)
                navigation.navigate('EditReview', { courseObj: courseObj })
              }}
            >
              Write a Review
            </Button>
          </View>

          <View style={{ flexDirection:'row', justifyContent:'space-between'}}>
            <View style={{ flex: 0.4, flexDirection:'row' }}>
              <Text style={[styles.boldLabel, {marginBottom:'5%'}]}>Reviews </Text>
              <Text style={[styles.boldLabel, {marginBottom:'5%'}]}>({ initCourseReviews && isFiltered && userFilteredReviews ? userFilteredReviews.length : initCourseReviews.length })</Text>
            </View>
            <View style={{ flex: 0.4, flexDirection:'flex-end' }}>
            <TouchableOpacity
                onPress={() => {

                  console.log('sending time !!', timeFilterOptions)
                  console.log('sending instur!!', instructorFilterOptions)
                  console.log('sending rating!!', ratingFilterOptions)

                  if (instructorFilterOptions && instructorFilterOptions.length > 0 && timeFilterOptions && timeFilterOptions.length > 0 && ratingFilterOptions && ratingFilterOptions.length > 0) {
                    navigation.navigate('ReviewFilter', { instructorFilterOptions: instructorFilterOptions, timeFilterOptions: timeFilterOptions, ratingFilterOptions:ratingFilterOptions, courseId: courseId, sortingChoice: sortingChoice })
                  }
                }}
              >
                {console.log('@@logic', sortingLogic)}
                {console.log('@@choice', sortingChoice)}
            <View style={{ flexDirection:'row', justifyContent:'space-evenly', alignItems:'center', borderRadius: '50%', backgroundColor: isFiltered && (initCourseReviews && userFilteredReviews && initCourseReviews.length !== userFilteredReviews.length)?   '#FFE3C4': 'transparent' }}>
               <Text style={{ color: '#4C338F' , fontWeight: !sortingLogic || sortingLogic === 'New to Old' ? 'normal' : 'bold' }}>{sortingLogic ? sortingLogic : sortingChoice}</Text>

              {/* <View>
              <Button
                mode={'contained'}
                style={{  backgroundColor:'#5F32D1' }}
                labelStyle={{ fontSize: 14 }}
              >
               sorting
                <MaterialCommunityIcons name="sort" size={24} style={{ color: '#4C338F',  }} />
              </Button>
              </View> */}

              {/* <View style={styles.centeredView}>
                <Modal
                  animationType="slide"
                  transparent={true}
                  visible={false}
                 >
                  <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                      {sortingOptions.map((option, index) => (
                        <TouchableOpacity
                          onPress={() => {}}
                          key={index}
                        >
                          <Text>666</Text>
                        </TouchableOpacity>

                      ))}
                      </View>
                    </View>
                </Modal>
              </View> */}
              


                <View style={{ borderRadius:'50%', width:40, justifyItems: 'center', alignItems:'center' }}>
                  <Ionicons name="filter" size={24} style={{ color: '#4C338F',  }} />
                </View>
            </View>
            </TouchableOpacity>
            </View>

          </View>



          <FlatList
              data={isFiltered ? userFilteredReviews : initCourseReviews } // Provide the data source
              renderItem={({ item }) => (
                <View style={styles.reviewCardContainer}>
                    <View style={styles.userContainer}>
                        <Text style={{ color:'#945610', fontWeight:'bold', marginRight:'4%', fontSize:16 }}>{ initUsers && initUsers.length > 0 && initUsers.filter(user => user.uid === item.userUid)[0]?.name}</Text>
                      {/* {console.log('!! initUsers', initUsers)} */}
                      <StarRating
                        rating={item.rating ? item.rating : 0}
                        onChange={() => {}}
                        starSize={20}
                        color='#FFCF00'
                        starStyle	={{ marginLeft: 0 }}
                      />
                    </View>
                    {/* backgroundColor:'#FCEDDC' */}
                    <View style={styles.courseInfoContainer}>
                      <Text style={{ color:'#4118A8', color:'#945610' }}>{item.term} {item.year}      {initInstructors && initInstructors.length > 0 && initInstructors.filter(ins => ins.id === item.instructorId)[0]?.name}</Text>
                      </View>
                      {/* {console.log('!!initInstructors', initInstructors)} */}

                  <View style={styles.reviewContentContainer}>
                    <Text>{item.reviewContent}</Text>
                  </View>

                </View>
              )}    
              keyExtractor={(item) => item.id} // Provide a unique key for each item
          />


        </View>
      </>)

      :(<View style={styles.body} >
        <Skeleton width={'100%'} height={60} backgroundColor='#EAE1FC' borderRadius={6} marginBottom={15} skeletonStyle={{ backgroundColor:'#F8F5FF' }} />
        <Skeleton width={'100%'} height={50} backgroundColor='#EAE1FC' borderRadius={6} marginBottom={30} skeletonStyle={{ backgroundColor:'#F8F5FF' }} />
        <Skeleton width={'40%'} height={40} backgroundColor='#EAE1FC' borderRadius={6} marginBottom={30} skeletonStyle={{ backgroundColor:'#F8F5FF' }} />
        <Skeleton width={'100%'} height={150} backgroundColor='#EAE1FC' borderRadius={6} marginBottom={15} skeletonStyle={{ backgroundColor:'#F8F5FF' }} />
        <Skeleton width={'100%'} height={150} backgroundColor='#EAE1FC' borderRadius={6} marginBottom={15} skeletonStyle={{ backgroundColor:'#F8F5FF' }} />
        <Skeleton width={'100%'} height={150} backgroundColor='#EAE1FC' borderRadius={6} marginBottom={15} skeletonStyle={{ backgroundColor:'#F8F5FF' }} />
      </View>)}

    </View>
  );
}

const styles = StyleSheet.create({
  ...generalStyles,
  reviewCardContainer: {
    marginBottom:'2%',
    marginTop:'2%',
    // backgroundColor: '#F8F5FF',
    borderColor:'#A592D4',
    borderWidth:'1.5',
    borderRadius: '8%',
    padding:'6%',
  },
  userContainer: {
    // backgroundColor: 'pink',
    marginBottom:'2%',
    flexDirection:'row',
    backgroundColor: '#F7F0E9',
    borderRadius:'4%'
  },
  courseInfoContainer: {
    marginBottom:'2%',
    marginTop:'2%'
  },
  reviewContentContainer: {
    // backgroundColor: '#F4F0FC',
    paddingBottom:'2%',
    color: '#333333'
  },
  boldLabel: {
    fontWeight: 'bold',
    color: '#4C338F',
    fontSize: 16
  },
  selectContainer: {
    marginTop: '10%',
    marginBottom:'10%',
    zIndex: 20
  },
  buttonContainer: {
    marginTop:'5%',
    marginBottom:'15%',
  
    alignSelf: 'center'
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});

export default CourseReviewsScreen;
