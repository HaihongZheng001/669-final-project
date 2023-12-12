import {useEffect, useState} from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback, Keyboard, FlatList, TouchableOpacity, Image } from 'react-native';
// import { Button } from '@rneui/themed';
import { generalStyles } from '../styles/Styles';
import { Header } from '../components/Header';
import { Ionicons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { memoryLruGarbageCollector } from 'firebase/firestore';
import { loadCourses, loadInstructors } from '../data/Actions';
import { Entypo } from '@expo/vector-icons';
import { ActivityIndicator } from 'react-native';
import { TextInput, Button } from 'react-native-paper'
import logo from '../assets/logo103.png';
import { FAB }from 'react-native-paper';

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
      // console.log('search word', searchWord)
      // console.log('@@result in the search courses function', result)
      setSearchResult(result)
      return result
    } else {
      setSearchResult([])
    }
  }

  const updateSuggestions = (text, items, setName, setSuggestions, setIsDropdownOpen) => {
    setName(text);
    if (text === '') {
      setSuggestions([]);
      setIsDropdownOpen(false);
    } else {
      const newSuggestions = items.filter(item => item.name.toLowerCase().includes(text.toLowerCase()));
      newSuggestions.unshift({name: text})
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
        // console.log('setting course id', courseId)
      } else if (name==='instructor') {
        setInstructorId(id)
        // console.log('setting instructor id', instructorId)
      }
    } 
    console.log('suggestion', suggestion)
    setName(suggestion);
    setIsDropdownOpen(false);
    searchCourses(suggestion)
    // setSearchWord('')
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
      // setSearchWord('')
      Keyboard.dismiss()
    }}>
      <View style={styles.container}>
        <Header title={'Welcome •ᴗ•'} showBackButton={false}/>

        <View style={styles.body}>
          <Image source={logo} style={styles.logoImage}/>

             {/* <View style={styles.centered}>
              <ActivityIndicator size="large" color="#0000ff" animating={showAnimation}/>
            </View> */}

          <View>
            <TextInput 
              onFocus={() => setSearchWord('')}
              style={{ 
                height: 50,
                // shadowColor: '#000',
                // shadowOffset: {
                //   width: 0,
                //   height: 2,
                // },
                // shadowOpacity: 0.23,
                // shadowRadius: 2.62,
                // backgroundColor:'#934A94'
              }}
              autoCapitalize='none'
              spellCheck={false}
              mode='outlined'
              placeholder="SI501, SI669..."
              placeholderTextColor="#A9A9A9"
              onChangeText={updateSearchSuggestions}
              value={searchWord}
              outlineColor='#5630B8'
              outlineStyle={{ borderRadius:'10%', borderWidth:'1.5' }}
              left={<TextInput.Icon icon="magnify" color="#5630B8" />}
              activeOutlineColor='#5630B8'
            />

            {/* <View style={styles.buttonContainer}>
              <Button
                style={{ borderRadius: '6%', justifyContent: 'center', width:'60%', backgroundColor:'#5F32D1' }}
                mode={'contained'}
                labelStyle={{ fontSize: 14 }}
                onPress={() =>{
                  navigation.navigate('EditReview')
                }}
              >
                Write a Review
              </Button>
          </View> */}
         
        {/* <View> */}
                {/* <View style={{ marginLeft:260, marginTop:'10%', zIndex:20}}>
                  <TouchableOpacity
                    onPress={() =>{
                      navigation.navigate('EditReview')
                    }}
                  >
                    <View style={styles.iconContainer}>
                      <Entypo name="plus" size={36} color="white" />
                    </View>
                  </TouchableOpacity>
                </View> */}

        {/* </View> */}
          
          <FlatList
              data={searchSuggestions}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  onPress={() => onSearchSuggestionPress(item.name)}
                >
                  <View style={{borderBottomWidth: 1, borderBottomColor:'white'}}>
                    <Text style={{ padding:'2%', paddingTop:'4%', paddingBottom:'4%' }}>{item.name}</Text>
                  </View>
                  
                </TouchableOpacity>
              )}
              keyExtractor={(item, index) => index.toString()}
              // style={styles.dropdownBox}
              style={{
                position: 'absolute',
                top: 50,
                left: 0,
                right: 0,
                zIndex: 15,
                maxHeight: 300,
                backgroundColor: 'white',
                display: isSearchDropdownOpen ? 'flex' : 'none', // Toggle visibility
                padding:'2%',
                opacity: 1,
                borderColor:'#5630B8',
                borderTopColor:'white',
                borderWidth:1.5,
                borderRadius: '10%',           
                backgroundColor:'#F3EDFF'
              }}
            />
               
            {/* <View style={styles.buttonContainer}>
              <Button
                style={{ borderRadius: '6%', height: 45, justifyContent: 'center', width:'60%', backgroundColor:'#5630B8' }}
                mode={'contained'}
                labelStyle={{ fontSize: 14 }}
                onPress={() =>{
                  navigation.navigate('EditReview')
                }}
              >
                Write a Review
              </Button>
          </View> */}

          {loadedCourses && searchResult && searchResult.length > 0 ?
            (<View style={[styles.searchCardContainer]}>
              { searchResult && searchResult.length > 0 ?
              <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                <Text style={styles.searchResultTitle}>Search Result</Text>
                <TouchableOpacity
                  onPress={() => {
                    setSearchResult([])
                    setSearchWord('')
                  }}
                >
                  <Text style={styles.searchResultClear}>Clear</Text> 
                </TouchableOpacity>
              </View>
              : null}
       
              <FlatList
                data={searchResult} // Provide the data source
                renderItem={({ item }) => (
                    // <Text>{item.reviewContent}</Text>
                    <TouchableOpacity
                      onPress={() => {
                        setSearchResult(null)
                        navigation.navigate('CourseReviews', {courseId: item.id})
                        setSearchWord('')
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
            :
            null
          }
            {/* <Ionicons name="ios-search" size={24} color="black" />        */}
          </View>
      
        </View>
        <View>
            <FAB
              icon="plus"
              color='white'
              style={{
                position: 'absolute',
                margin: 2,
                right:'-45%',
                bottom:10,
                borderRadius:'50%',
                backgroundColor:'#5F32D1',
                width:60,
                height: 60,
                alignItems:'center',
                justifyContent:'center',
              }}
              onPress={() => navigation.navigate('EditReview')}
            />
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
    marginTop: '10%',
    // backgroundColor: 'pink',
  },
  searchCardLabel: {
    marginTop: '4%',
    marginBottom: '4%',
    paddingTop: '2%',
    paddingBottom: '2%'

  },
  searchCardLabelContainer: {
    // borderTopWidth: 1,
    borderBottomWidth:1,
    borderColor: 'white',
    borderColor: 'lightgrey',
    borderRadius:'6%',
    padding:'4%',
    marginBottom: '2%',
    backgroundColor:'#F2EDFF'
  },
  searchResultTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    paddingTop: '2%',
    paddingBottom: '2%',
    color: '#5630B8',
    marginBottom: '6%'
  },
  searchResultClear: {
    // fontWeight: 'bold',
    fontSize: 18,
    paddingTop: '2%',
    paddingBottom: '2%',
    color: '#5630B8',
    marginBottom: '6%'
  },
  iconContainer: {
    position:'absolute',
    width: 60,  // Diameter of the circle
    height: 60, // Same as width
    borderRadius: 30, // Half of width/height
    backgroundColor: '#5630B8', // Circle color
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
    // shadowColor: '#87C4FF',
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.3,
    // shadowRadius: 5,
    // elevation: 4, 
  },
  logoImage: {
    width: 300,
    height: 100,
    marginBottom: '10%',
    alignSelf:'center'
  },
});

export default HomeScreen;
