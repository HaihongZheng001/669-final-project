import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, FlatList, keyExtractor, TouchableOpacity, ScrollView } from 'react-native';
import { Button } from '@rneui/themed';
import { generalStyles } from '../styles/Styles';
import { Header } from '../components/Header';
import { subscribeToAuthChanges } from '../AuthManager';
import { useSelector, useDispatch } from 'react-redux';
import { loadCourses, loadInstructors, addReview } from '../data/Actions';
import { getAuth } from 'firebase/auth';
// import Autocomplete from 'react-native-autocomplete-input';

function EditReviewScreen(props) {
  const { navigation, route } = props
  // useEffect(()=> {
  //   subscribeToAuthChanges(navigation);
  // }, []);

  // useEffect(()=>{
  //   console.log('navigation',navigation)
  // }
  // ,[navigation])
  const [courseName, setCourseName] = useState('');
  const [year, setYear] = useState('');
  const [term, setTerm] = useState('');
  const [instructor, setInstructor] = useState('');
  const [rating, setRating] = useState('');
  const [reviewContent, setReviewContent] = useState('');
  const [loginUser, setLoginUser] = useState(null);
  const [courseSuggestions, setCourseSuggestions] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [instructorSuggestions, setInstructorSuggestions] = useState([]);
  const [isCourseDropdownOpen, setIsCourseDropdownOpen] = useState(false);
  const [isInstructorDropdownOpen, setIsInstructorDropdownOpen] = useState(false);
  const [isTermDropdownOpen, setIsTermDropdownOpen] = useState(false);
  const [termSuggestions, setTermSuggestions] = useState([]);
  const [courseId, setCourseId] = useState(null)
  const [instructorId, setInstructorId] = useState(null)

  const courseObj = null;

  // const { courseObj } = route.params || null;
  // console.log('!!!courseObj in edit review', courseObj)



  const terms = [{id: '11', name: 'Fall'}, {id: '22', name: 'Winter'}, {id: '33', name: 'Summer'}, {id: '44', name: 'Spring'}, {id: '55', name: 'Spring/Summer'}]



  const dispatch = useDispatch();
  const courses = useSelector(state => {
    // console.log('courses in review page!!!', state.courses)
    return state.courses
  })

  const instructors = useSelector(state => {
    // console.log('instructors in review page!!!', state.instructors)
    return state.instructors
  })


  useEffect(()=>{
    dispatch(loadCourses());
    dispatch(loadInstructors())
  }, []);

  useEffect(() => {
    const auth = getAuth();
    auth.onAuthStateChanged((user) => {
      // console.log('!!auth user in review page', user)
      setLoginUser(user);
    });
  }, []);

  //below is actively used
  const updateSuggestions = (text, items, setName, setSuggestions, setIsDropdownOpen) => {
    setName(text);
    if (text === '') {
      setSuggestions([]);
      setIsDropdownOpen(false);
    } else {
      const newSuggestions = items
        // .map(item => item.name)
        .filter(item => item.name.toLowerCase().includes(text.toLowerCase()));
  
      if (newSuggestions.length > 0) {
        setIsDropdownOpen(true);
      } else {
        setIsDropdownOpen(false);
      }
      setSuggestions(newSuggestions);
    }
  };
  
  const onSuggestionPress = (suggestion, setName, setIsDropdownOpen, setSuggestions, id=null, name=null) => {
    if (id && name) {
       if (name==='course') {
        setCourseId(id)
        console.log('setting course id', courseId)
      } else if (name==='instructor') {
        setInstructorId(id)
        console.log('setting instructor id', instructorId)

      }
    } 
    setName(suggestion);
    setIsDropdownOpen(false);
    setSuggestions([]);

  };

  const updateCourseSuggestions = (text) => {
    updateSuggestions(text, courses, setCourseName, setCourseSuggestions, setIsCourseDropdownOpen);
  };
  
  const onCourseSuggestionPress = (suggestion, id, name) => {
    onSuggestionPress(suggestion, setCourseName, setIsCourseDropdownOpen, setCourseSuggestions, id, name);
  };

  const updateInstructorSuggestions = (text) => {
    updateSuggestions(text, instructors, setInstructor, setInstructorSuggestions, setIsInstructorDropdownOpen);
  };
  
  const onInstructorSuggestionPress = (suggestion, id, name) => {
    onSuggestionPress(suggestion, setInstructor, setIsInstructorDropdownOpen, setInstructorSuggestions, id, name);
  };

  const updateTermSuggestions = (text) => {
    updateSuggestions(text, terms, setTerm, setTermSuggestions, setIsTermDropdownOpen);
  };
  
  const onTermSuggestionPress = (suggestion) => {
    onSuggestionPress(suggestion, setTerm, setIsTermDropdownOpen, setTermSuggestions);
  };
  



  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>

    <KeyboardAvoidingView 
      behavior='padding'
      keyboardVerticalOffset={350}
      style={styles.container}
    >
    {/* <View style={styles.container}> */}
      <Header title={'Edit Review'} showBackButton={true} navigation={navigation} />

      <View style={styles.body}>
        <View style={styles.listItemContainer}>
          <View style={styles.labelContainer}>
            <Text style={styles.labelText}>Course No. & Name</Text>
          </View>
          <View style={styles.inputContainer}>
            <TextInput 
              style={styles.inputBox}
              autoCapitalize='none'
              spellCheck={false}
              onChangeText={updateCourseSuggestions}
              value={courseObj ? courseObj.name : courseName}
            />
          </View>
        </View>


        <FlatList
              data={courseSuggestions}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  onPress={() => onCourseSuggestionPress(item.name, id=item.id, inputData='course')}
                >
                  <Text style={{ opacity:1, paddingBottom:'2%'}}>{item.name}</Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item, index) => index.toString()}
              // style={styles.dropdownBox}
              style={{
                position: 'absolute',
                top: 80,
                left: 0,
                right: 0,
                zIndex: 20,
                maxHeight: 300,
                backgroundColor: 'white',
                display: isCourseDropdownOpen ? 'flex' : 'none', // Toggle visibility
                padding:'2%',
                marginLeft: '5.5%',
                marginRight: '3.5%',
                opacity: 1,
                borderColor:'grey',
                borderTopColor:'white',
                borderWidth:1,
                borderRadius: '4%'
              }}
            />


        <View style={styles.listItemMoreContainer}>

          <View style={styles.sideItemContainer}>
            <View style={styles.sideLabelContainer}>
              <Text style={styles.labelText}>Year</Text>
            </View>
            <View style={styles.sideInputContainer}>
              <TextInput 
                style={styles.sideInputBox}
                autoCapitalize='none'
                spellCheck={false}
                keyboardType='numeric'
                onChangeText={text=>setYear(text)}
                value={year}
              />
            </View>
          </View>

          <View style={styles.sideItemContainer}>
            <View style={styles.sideLabelContainer}>
              <Text style={styles.labelText}>Term</Text>
            </View>
            <View style={styles.sideInputContainer}>
              <TextInput 
                style={styles.sideInputBox}
                autoCapitalize='none'
                spellCheck={false}
                onChangeText={text=>updateTermSuggestions(text)}
                value={term}
              />
            </View>
          </View>
          
        </View>

        <FlatList
              data={termSuggestions}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  onPress={() => onTermSuggestionPress(item.name)}
                >
                  <Text style={{ opacity:1, paddingBottom:'3%'}}>{item.name}</Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item, index) => index.toString()}
              // style={styles.dropdownBox}
              style={{
                position: 'absolute',
                top: 142,
                width:'30%',
                left: 200,
                right: 0,
                zIndex: 20,
                maxHeight: 300,
                backgroundColor: 'white',
                display: isTermDropdownOpen ? 'flex' : 'none', // Toggle visibility
                padding:'2%',
                marginLeft:'6%',
                marginRight: '3%',
                opacity: 1,
                borderColor:'grey',
                borderTopColor:'white',
                borderWidth:1,
                borderRadius: '4%'
              }}
            />

        <View style={styles.listItemContainer}>
          <View style={styles.labelContainer}>
            <Text style={styles.labelText}>Instructor</Text>
          </View>
          <View style={styles.inputContainer}>
            <TextInput 
              style={styles.inputBox}
              autoCapitalize='none'
              spellCheck={false}
              onChangeText={text=>updateInstructorSuggestions(text)}
              value={instructor}
            />
          </View>
        </View>

        <FlatList
              data={instructorSuggestions}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  onPress={() => onInstructorSuggestionPress(item.name, id=item.id, inputData='instructor')}
                >
                  <Text style={{ opacity:1, paddingBottom:'2%'}}>{item.name}</Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item, index) => index.toString()}
              // style={styles.dropdownBox}
              style={{
                position: 'absolute',
                top: 216,
                left: 0,
                right: 0,
                zIndex: 20,
                maxHeight: 300,
                backgroundColor: 'white',
                display: isInstructorDropdownOpen ? 'flex' : 'none', // Toggle visibility
                padding:'2%',
                marginLeft: '5.5%',
                marginRight: '3.5%',
                opacity: 1,
                borderColor:'grey',
                borderTopColor:'white',
                borderWidth:1,
                borderRadius: '4%'
              }}
            />

        <View style={styles.listItemContainer}>
          <View style={styles.labelContainer}>
            <Text style={styles.labelText}>Rating</Text>
          </View>
          <View style={styles.inputContainer}>
            <TextInput 
              style={styles.inputBox}
              autoCapitalize='none'
              spellCheck={false}
              onChangeText={text=>setRating(text)}
              value={rating}
              keyboardType='numeric'
            />
          </View>
        </View>
        <View style={styles.longListItemContainer}>
          <View style={styles.labelContainer}>
            <Text style={styles.labelText}>Review</Text>
          </View>
          <View style={styles.longInputContainer}>
            <TextInput 
              style={styles.longInputBox}
              autoCapitalize='none'
              spellCheck={false}
              onChangeText={text=>setReviewContent(text)}
              value={reviewContent}
              multiline
              textAlign='left'
              textAlignVertical='top'
            />
          </View>
        </View>


        <View style={styles.buttonContainer}>
          <Button
            onPress={() =>{
              // console.log('courseId!!', courseId)
              // console.log('login user', loginUser.uid)
              // console.log('instructor id', instructorId)
              // console.log(year)
              // console.log(term)
              // console.log(rating)
              // console.log(reviewContent)
              if (courseObj) {
                console.log('update course review')
                navigation.goBack()


              } else {
                dispatch(addReview({
                  userUid: loginUser.uid,
                  courseId: courseId,
                  year: year,
                  term: term,
                  instructorId: instructorId,
                  rating: rating,
                  reviewContent: reviewContent,
                }));
                navigation.navigate('HomePage')
              }
            }}
          >
            Submit
          </Button>  
        </View> 

        <View style={styles.buttonContainer}>
          <Button
            onPress={() =>{
              if(navigation) {
                navigation.goBack();
              }
            }}
          >
            Cancel
          </Button>  
        </View> 

      </View>
    {/* </View> */}
    </KeyboardAvoidingView>
    </TouchableWithoutFeedback>

  );
}

const styles = StyleSheet.create({
 ...generalStyles,
 overlay: {
  width: '80%', // Adjust the width of the overlay
  height: '50%', // Adjust the height of the overlay
  justifyContent: 'center',
  alignItems: 'center',
},
});

export default EditReviewScreen;
