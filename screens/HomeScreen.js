import {useEffect, useState} from 'react';
import { View, Text, StyleSheet, TextInput, TouchableWithoutFeedback, Keyboard, FlatList, TouchableOpacity } from 'react-native';
import { Button } from '@rneui/themed';
import { generalStyles } from '../styles/Styles';
import { Header } from '../components/Header';
import { Ionicons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { memoryLruGarbageCollector } from 'firebase/firestore';
import { loadCourses, loadInstructors } from '../data/Actions';
import { Entypo } from '@expo/vector-icons';
import { ActivityIndicator } from 'react-native';
import { FAB } from 'react-native-paper';

// import { updateSuggestions, onSuggestionPress } from './dropdownUtils.js';





function HomeScreen(props) {
  const { navigation, route } = props
  const [searchWord, setSearchWord] = useState('');
  const [loadedCourses, setLoadedCourses] = useState([]);
  const [searchResult, setSearchResult] = useState([]);
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState(false)
  const [showAnimation, setShowAnimation] = useState(true)

  const initCourses = useSelector(state => {
    // console.log('@@homepage courses', state.courses)
    return state.courses
  })

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadCourses())
   
  }, [])

  useEffect(() => {
    if (initCourses) {
      setLoadedCourses(initCourses)
    }
  }, [initCourses])

  // console.log('!!loaded Courses in search page',loadCourses)

  const searchCourses = (searchWord) => {
    // console.log('search word', searchWord)
    console.log('loaded courses!', loadedCourses)
    if (searchWord !== '') {
      const result = loadedCourses.filter(courseObj => courseObj.name.toLowerCase().includes(searchWord.toLowerCase()))
      console.log('search word', searchWord)
      console.log('@@result in the search courses function', result)
      setSearchResult(result)
      return result
    }
 
  }

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

  const updateSearchSuggestions = (text) => {
    updateSuggestions(text, initCourses, setSearchWord, setSearchSuggestions, setIsSearchDropdownOpen);
  };
  
  const onSearchSuggestionPress = (suggestion) => {
    onSuggestionPress(suggestion, setSearchWord, setIsSearchDropdownOpen, setSearchSuggestions);
  };




  return (
    <TouchableWithoutFeedback onPress={() => {
      setIsSearchDropdownOpen(false)
      Keyboard.dismiss()
    }}>
      <View style={styles.container}>
        
        <Header title={'Welcome •ᴗ•'} showBackButton={false}/>
        <View style={styles.body}>
        
             {/* <View style={styles.centered}>
              <ActivityIndicator size="large" color="#0000ff" animating={showAnimation}/>
            </View> */}
             
          
          <View>
            <TextInput 
              placeholder="search 'si501', '669'..."
              style={[styles.inputBox, styles.searchInputBox]}
              autoCapitalize='none'
              spellCheck={false}
              onChangeText={updateSearchSuggestions}
              value={searchWord}
            />

            <View style={styles.buttonContainer}>
              <Button
                onPress={() => {
                  searchCourses(searchWord)
                  console.log('search word', searchWord)
                  console.log('search result', searchResult)
                  setSearchWord('')
                }}
              >
                Search Course
              </Button>
          </View>

          <FlatList
              data={searchSuggestions}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  onPress={() => onSearchSuggestionPress(item.name)}
                >
                  <Text style={{ opacity:1, paddingBottom:'4%'}}>{item.name}</Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item, index) => index.toString()}
              // style={styles.dropdownBox}
              style={{
                position: 'absolute',
                top: '25%',
                left: 0,
                right: 0,
                zIndex: 15,
                maxHeight: 300,
                backgroundColor: 'white',
                display: isSearchDropdownOpen ? 'flex' : 'none', // Toggle visibility
                padding:'2%',
                opacity: 1,
                borderColor:'grey',
                borderTopColor:'white',
                borderWidth:1,
                borderRadius: '4%'
              }}
            />

          {loadedCourses && searchResult &&
            (<View style={[styles.searchCardContainer]}>
              {/* <Text style={styles.searchResultTitle}>Searching Result</Text> */}
              <FlatList
                data={searchResult} // Provide the data source
                renderItem={({ item }) => (
                    // <Text>{item.reviewContent}</Text>
                    <TouchableOpacity
                      onPress={() => {
                        setSearchResult(null)
                        navigation.navigate('CourseReviews', {courseId: item.id})
                      }}
                    >
                      <View style={styles.searchCardLabelContainer}>
                          <Text style={styles.searchCardLabel}>
                            {item.name}
                          </Text>
                      </View>
                      </TouchableOpacity>


                )}
                keyExtractor={(item) => item.id} // Provide a unique key for each item
              />
            </View>)
          }
            {/* <Ionicons name="ios-search" size={24} color="black" />        */}
          </View>
          <View style={{marginLeft:'40%', marginTop: '75%', zIndex:20}}>
            <TouchableOpacity
              onPress={() =>{
                navigation.navigate('EditReview')
              }}
            >
              <View style={styles.iconContainer}>
                <Entypo name="plus" size={36} color="black" />
              </View>
            </TouchableOpacity>
          </View>
        </View>
            
      </View>
    </TouchableWithoutFeedback>

  );
}

const styles = StyleSheet.create({
  ...generalStyles,
  searchInputBox: {
    marginTop: '8%',
    marginBottom: '8%'
  },
  reviewButtonContainer: {
    marginTop: '70%',
  },
  searchCardContainer: {
    marginTop: '30%',
    // backgroundColor: 'pink',
  },
  searchCardLabel: {
    marginTop: '4%',
    marginBottom: '4%',
    paddingTop: '2%',
    paddingBottom: '2%'

  },
  searchCardLabelContainer: {
    borderWidth: 1,
    borderColor: 'white',
    borderBottomColor: 'lightgrey'
  },
  searchResultTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    paddingTop: '2%',
    paddingBottom: '2%'
  },
  iconContainer: {
    position:'absolute',
    width: 60,  // Diameter of the circle
    height: 60, // Same as width
    borderRadius: 30, // Half of width/height
    backgroundColor: '#AEDEFC', // Circle color
    justifyContent: 'center', // Center the icon horizontally
    alignItems: 'center', 
    //shadow effect
    // shadowColor: 'pink',
    // shadowOffset: {
    //   width: 6,
    //   height: 6
    // },
    // shadowOpacity: 0.4,
    // shadowRadius: 4

    // blur effect
    shadowColor: '#87C4FF',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4, 
  },
});

export default HomeScreen;
