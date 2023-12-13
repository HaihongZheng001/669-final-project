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
import { CheckBox } from '@rneui/themed';
import { Ionicons } from '@expo/vector-icons';
// import { updateSuggestions, onSuggestionPress } from './dropdownUtils.js';
// import { MultipleSelectList } from 'react-native-dropdown-select-list';
// import { IndexPath, Layout, Select, SelectItem } from '@ui-kitten/components';

function CourseReviewsScreen(props) {
  const { navigation, route } = props;
  // const { courseId, isFiltered, checkedInstructors, checkedRatings, checkedTimes, sortingLogic } = route.params || {};
    const { courseId } = route.params || {};

  

  const [initCourseReviews, setInitCourseReviews] = useState([]); 
  const [rating, setRating] = useState(0);

  const initUsers = useSelector(state => state.users)
  const reviews = useSelector(state => state.reviews)
  const initInstructors = useSelector(state => state.instructors)

  const [timeFilterOptions, setTimeFilterOptions] = useState([]);
  const [tempTimeFilterOptions, setTempTimeFilterOptions] = useState([])
  const [ratingFilterOptions, setRatingFilterOptions] = useState([])
  const [tempRatingFilterOptions, setTempRatingFilterOptions] = useState([])
  const [instructorFilterOptions, setInstructorFilterOptions] = useState([]);
  const [tempInstructorFilterOptions, setTempInstructorFilterOptions] = useState([])
  const [sortingChoice, setSortingChoice ] = useState('New to Old')
  const [tempSortingChoice, setTempSortingChoice] = useState('New to Old')
  const [showFilter, setShowFilter] = useState(false)
  const [isFilterActive, setIsFilterActive] = useState(false)
  const [userFilteredReviews, setUserFilteredReviews] = useState([])




  const getUserFilteredReviews = (checkedInstructors, checkedRatings, checkedTimes, checkedSorting) => {
  
    if (initCourseReviews && checkedRatings && checkedTimes && checkedTimes.length > 0 && checkedInstructors && checkedInstructors.length > 0 ) {
      
      const checkedInstructorIds = checkedInstructors.filter(item => item.isChecked).map(ins => ins.id)
      const checkedRatingsNew = checkedRatings.filter(item => item.isChecked).map(obj => obj.rating)
      const checkedYear = checkedTimes.filter(item => item.isChecked).map(t => t.year)
      const checkedTerm = checkedTimes.filter(item => item.isChecked).map(t => t.term)

      const checkedReviews = initCourseReviews.filter(review => checkedTerm.includes(review.term) && checkedYear.includes(review.year) && checkedInstructorIds.includes(review.instructorId) && checkedRatingsNew.includes(review.rating))
      const sortedReviews = sortReviews(checkedReviews, checkedSorting)
      console.log('---sorrted result', sortedReviews)

      return sortedReviews
      
    }
  }

  const sortingOptions = [
    { name: 'New to Old', logic: 'newToOld'},
    { name: 'Old to New', logic: 'oldToNew' },
    { name: 'High to Low', logic:'highToLoW' },
    { name: 'Low to High', logic:'lowToHigh' },
  ]

  const checkFilterResultDiffers = (list1, list2, list3) => {
    let areAllChecked1 = list1.every(obj => obj.isChecked === true);
    let areAllChecked2 = list2.every(obj => obj.isChecked === true);
    let areAllChecked3 = list3.every(obj => obj.isChecked === true);
    let result = areAllChecked1 && areAllChecked2 && areAllChecked3
    return !result;
  }

   
  const toggleCheckbox = (setItems, items, pressedItem) => {
      // console.log('item', pressedItem)
      setItems(prev => {
          const updatedItems = items.map(item => {
              if (item.id === pressedItem.id) {
                return { ...item, isChecked: !pressedItem.isChecked};
              } else {
                return item;
  
              }
            })
          return updatedItems
      });
  };

  const sortReviews = (reviewsToSort, curLogic) => {
    let result = [...reviewsToSort];
  
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
      result.sort((a, b) => sortByYearAndTerm(a, b, false));
    } else if (curLogic === 'High to Low') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (curLogic === 'Low to High') {
      result.sort((a, b) => a.rating - b.rating);
    }
    return result;
  }
  

  const getTimeFilterOptions = (inputReviews) => {
    
      let timeStrList = [];
      inputReviews.map(reviewObj => {
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
      return result
      // setTimeFilterOptions(result)

  }

  const getRatingFilterOptions = (inputReviews) => {
      let ratingList = []
      inputReviews.map(reviewObj => {
        if (!ratingList.includes(reviewObj.rating)) {
          ratingList.push(reviewObj.rating)
          // console.log('!!list', ratingList)
        }
      })
      // console.log('rating list', ratingList)
      const result = ratingList.map((r, index) => ({ rating: r, id:index, isChecked: true }))
      const sortedResult = result.sort((a, b) => b.rating - a.rating)
      return sortedResult
      // setRatingFilterOptions(result)
  }

  const getInstructorFilterOptions = (inputReviews, inputInstructors) => {
    // console.log('getting instuctors options!!! cur init course reviews value', initCourseReviews)
      let idList = [];
      inputReviews.map(reviewObj => {
        if (!idList.includes(reviewObj.instructorId)) {
          idList.push(reviewObj.instructorId)
        }
      })
      // console.log('idList!!!!', idList)
      const result = inputInstructors.filter(ins => idList.includes(ins.id)).map(obj=> ({ id: obj.id, name: obj.name, isChecked: true }))
      // console.log('instructor options generating!', result)
      return result
      // setInstructorFilterOptions(result)
  }
  

  const dispatch = useDispatch();

  useEffect(() => {
    // dispatch(loadCourseReviews(courseId))
    dispatch(loadUsers())
    dispatch(loadInstructors())
    dispatch(loadReviews())

  }, [])

  useEffect(() => {
    if ((isFilterActive && checkFilterResultDiffers) || (isFilterActive && sortingChoice !== 'New to Old')) {
      const resultReviews = getUserFilteredReviews(instructorFilterOptions, ratingFilterOptions, timeFilterOptions, sortingChoice)
      setUserFilteredReviews(resultReviews)
    }
  },[instructorFilterOptions, timeFilterOptions, ratingFilterOptions, sortingChoice])



  useEffect(() => {
    const filteredReviews = reviews.filter(review => review.courseId === courseId)
    const TimeSortedFilteredReviews = sortReviews(filteredReviews, 'New to Old') //sort by time, rating sort happens in getRating Options
    if (filteredReviews && filteredReviews.length > 0 && initInstructors && initInstructors.length > 0) {
      setInitCourseReviews(TimeSortedFilteredReviews)
      getCourseRating(TimeSortedFilteredReviews)
      const iResult = getInstructorFilterOptions(TimeSortedFilteredReviews, initInstructors)
      const tResult = getTimeFilterOptions(TimeSortedFilteredReviews)
      const rResult = getRatingFilterOptions(TimeSortedFilteredReviews)
      setRatingFilterOptions(rResult)
      setTempRatingFilterOptions(rResult)
      setTimeFilterOptions(tResult)
      setTempTimeFilterOptions(tResult)
      setInstructorFilterOptions(iResult)
      setTempInstructorFilterOptions(iResult)
    }
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


  

  

  return (
    <View style={styles.container}>
     <Header navigation={navigation} title={'Course Reviews'} showBackButton={true} />
      
     {courseObj && initCourseReviews ? (
     <>
      <View style={styles.body}>
          <Text style={styles.boldLabel}>{courseObj.name}</Text>
          <View style={{ flexDirection:'row', alignItems:'center', marginTop:'2%'}}>
            <Text style={{marginTop: '5%', marginBottom:'4%',marginRight:'2%', color: '#4C338F', fontWeight:'bold' }}>Overall Rating: </Text>
        
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
                navigation.navigate('EditReview', { courseObj: courseObj })
              }}
            >
              Write a Review
            </Button>
          </View>

          <View style={{ flexDirection:'row', justifyContent:'space-between'}}>
            <View style={{ flex: 0.4, flexDirection:'row' }}>
              <Text style={[styles.boldLabel, {marginBottom:'5%'}]}>Reviews </Text>
              <Text style={[styles.boldLabel, {marginBottom:'5%'}]}>({ isFilterActive  && checkFilterResultDiffers(timeFilterOptions, ratingFilterOptions, instructorFilterOptions && userFilteredReviews) ?  userFilteredReviews.length : initCourseReviews.length })</Text>
            </View>
            <View style={{ flex: 0.4, flexDirection:'flex-end' }}>
              <TouchableOpacity onPress={() => setShowFilter(true)}>
                <View style={{ flexDirection:'row', justifyContent:'space-evenly', alignItems:'center', borderRadius: '50%', backgroundColor: isFilterActive && checkFilterResultDiffers(timeFilterOptions, ratingFilterOptions, instructorFilterOptions) ?  '#FFE3C4' : 'transparent'  }}>
                  <Text style={{ color: '#4C338F' , fontWeight: sortingChoice === 'New to Old' ? 'normal' : 'bold' }}>{sortingChoice}</Text>

                    <View style={{ borderRadius:'50%', width:40, justifyItems: 'center', alignItems:'center' }}>
                      <Ionicons name="filter" size={24} style={{ color: '#4C338F',  }} />
                    </View>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {showFilter ?<View style={styles.centeredView}>
          <Modal
            animationType='fade'
            transparent={true}
            visible={showFilter}
            >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                {/* sorting */}
                <Text style={{ fontWeight:'bold', backgroundColor:'#F1EBFF', marginBottom:10 }}>Sort</Text>
                <FlatList
                    data={sortingOptions}
                    renderItem={({item}) => (
                    <View style={{ flexDirection:'row', alignItems:'center' }}>
                      <CheckBox
                          title={`${item.name}`}
                          checked={item.name === tempSortingChoice ? true : false}
                          onPress={() => setTempSortingChoice(item.name)}
                          containerStyle={{ backgroundColor: 'transparent', padding:0 }}
                          checkedColor="#31BD43"
                          textStyle={{ fontWeight: item.name === tempSortingChoice ? 'bold' : 'normal' }}
                      />
                    </View>
                    )}
                    keyExtractor={(item, index) => index.toString()}
                />
                {/* instructor filter */}
                <Text style={{ fontWeight:'bold', backgroundColor:'#F1EBFF', marginBottom:10 }}>Instructors</Text>
                <FlatList
                    data={tempInstructorFilterOptions}
                    renderItem={({item}) => (
                    <View style={{ flexDirection:'row', alignItems:'center' }}>
                        <CheckBox
                            title={`${item.name}`}
                            checked={item.isChecked}
                            onPress={() => toggleCheckbox(setTempInstructorFilterOptions, tempInstructorFilterOptions, item)}
                            textStyle={{ fontWeight: item.isChecked ? 'bold' : 'normal' }}
                            containerStyle={{ backgroundColor: 'transparent', padding:0 }}
                            checkedColor="#31BD43"
                        />
                    </View>
                    )}
                    keyExtractor={item => item.id}
                />
                {/* rating filter */}
                <Text style={{ fontWeight:'bold', backgroundColor:'#F1EBFF', marginBottom:10 }}>Rating</Text>
                <FlatList
                  data={tempRatingFilterOptions}
                  renderItem={({item}) => (
                  <View style={{ flexDirection:'row', alignItems:'center' }}>
                      <CheckBox
                          checked={item.isChecked }
                          onPress={() => {
                              toggleCheckbox(setTempRatingFilterOptions, tempRatingFilterOptions, item)
                          }}
                          textStyle={{ fontWeight: item.isChecked ? 'bold' : 'normal' }}
                          title={`${item.rating}`}
                          containerStyle={{ backgroundColor: 'transparent', padding:0 }}
                          checkedColor="#31BD43"
                      />
                      <StarRating
                          rating={item.rating}
                          onChange={() => {}}
                          starSize={20}
                          color='#FFCF00'
                          starStyle={{ marginLeft: 0 }}
                      />
                  </View>
                )}
                  keyExtractor={item => item.id}
                />
                {/* time filter */}
                <Text style={{ fontWeight:'bold', backgroundColor:'#F1EBFF', marginBottom:10 }}>Time</Text>
                <FlatList
                    data={tempTimeFilterOptions}
                    renderItem={({item}) => (
                    <View style={{ flexDirection:'row', alignItems:'center' }}>
                        <CheckBox
                            checked={item.isChecked}
                            onPress={() => toggleCheckbox(setTempTimeFilterOptions, tempTimeFilterOptions, item)}
                            textStyle={{ fontWeight: item.isChecked ? 'bold' : 'normal' }}
                            title={`${item.time}`}
                            containerStyle={{ backgroundColor: 'transparent', padding:0 }}
                            checkedColor="#31BD43"
                        />
                    </View>
                    )}
                    keyExtractor={item => item.id}
                />


              <View style={ styles.pairButtonContainer}>
                <Button 
                    mode='contained' 
                    style={{ backgroundColor:'#A66319' }}
                    labelStyle={{ fontSize: 14 }}
                    onPress={() => {
                      setShowFilter(false)
                      setTempInstructorFilterOptions(instructorFilterOptions)
                      setTempRatingFilterOptions(ratingFilterOptions)
                      setTempTimeFilterOptions(timeFilterOptions)
                      setTempSortingChoice(sortingChoice)
                    }} 
                >
                  Cancel
                </Button>
                <Button 
                  mode={'contained'}
                  style={{  backgroundColor:'#5F32D1' }}
                  labelStyle={{ fontSize: 14 }}
                  onPress={() => {
                    setIsFilterActive(true)
                    setInstructorFilterOptions(tempInstructorFilterOptions)
                    setRatingFilterOptions(tempRatingFilterOptions)
                    setTimeFilterOptions(tempTimeFilterOptions)
                    setSortingChoice(tempSortingChoice)
                    setShowFilter(prev => {
                      if (instructorFilterOptions === tempInstructorFilterOptions && ratingFilterOptions === tempRatingFilterOptions && timeFilterOptions === tempTimeFilterOptions && sortingChoice === tempSortingChoice) {
                        // console.log('intsurctor options', instructorFilterOptions)
                        // console.log('temp ins', tempInstructorFilterOptions)
                        // console.log('rating options', ratingFilterOptions)
                        // console.log('temp rating', tempRatingFilterOptions)
                        // console.log('time options', timeFilterOptions)
                        // console.log('temp time', tempTimeFilterOptions)
                        return false
                      } 
                    })
                  }}
                >
                    Apply
                </Button>
              </View>
                

                </View>
              </View>
              
          </Modal>
        </View> : null}




          <FlatList
              data={ (isFilterActive && checkFilterResultDiffers(timeFilterOptions, ratingFilterOptions, instructorFilterOptions)) || sortingChoice !== 'New to Old' ? userFilteredReviews : initCourseReviews} // Provide the data source
              renderItem={({ item }) => (
                <View style={styles.reviewCardContainer}>
                    {/* {console.log('init course reviews', initCourseReviews)}
                    {console.log('user filtered course reviews', userFilteredReviews)} */}
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
                          {
                            item.reviewContent.split(' ').length > 50 ?
                              <Text style={{ lineHeight:20 }}>{item.reviewContent.split(' ').slice(0, 50).join(' ')} ...
                                <TouchableOpacity 
                                  onPress={() => navigation.navigate('ExpandReview', {reviewObj: item, userObj: initUsers && initUsers.length > 0 && initUsers.filter(user => user.uid === item.userUid)[0], courseObj: courseObj })}
                                >
                                  <Text style={{ color:'purple' }}>[Read More]</Text>
                                </TouchableOpacity>
                              </Text>
                              :
                              <Text style={{ lineHeight:20 }}>{item.reviewContent}</Text>
                          }

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
    fontSize: 16,
    lineHeight: 20
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
    marginTop: 0,
    backgroundColor:'rgba(0, 0, 0, 0.6)',
  },
  modalView: {
    flex:0.8,
    // margin: '10%',
    backgroundColor: 'white',
    borderRadius: '6%',
    padding: '5%',
    alignItems: 'flex-start',
    width: '90%',
    backgroundColor:'#FFFAFF',
    
    // justifyContent:'flex-start',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  pairButtonContainer:{
    flexDirection:'row',
    justifyContent:'space-around',
    // backgroundColor:'pink',
    width:'100%',
    
  }
});

export default CourseReviewsScreen;
