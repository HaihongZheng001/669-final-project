import React, {useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { loadInstructors, loadUsers, loadReviews } from '../data/Actions';
import { Header } from '../components/Header';
import { generalStyles } from '../styles/Styles';
// import { Button } from '@rneui/themed';
import StarRating from 'react-native-star-rating-widget';
import { Button } from 'react-native-paper';
import { Skeleton } from '@rneui/themed';
import { FontAwesome } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import RBSheet from "react-native-raw-bottom-sheet";
import { createDrawerNavigator } from '@react-navigation/drawer';
// import { Checkbox } from 'react-native-paper';
import { CheckBox } from '@rneui/themed';






function ReviewFilterScreen(props) {
    const { navigation, route } = props

    const { timeFilterOptions, instructorFilterOptions, ratingFilterOptions, courseId, sortingChoice } = route.params || {};
    // const [userFilters, setUserFilters] = useState(
    //     {
    //         ratings: [],
    //         instructorIds:[],
    //         terms:[],
    //         years: [],
    //     }
    // )
    // tracking checked state
    const [instructors, setInstructors] = useState(instructorFilterOptions)
    const [ratings, setRatings] = useState(ratingFilterOptions)
    const [times, setTimes] = useState(timeFilterOptions)
    const [sortingLogic, setSortingLogic] = useState(sortingChoice)



  const sortingOptions = [
    { name: 'New to Old', logic: 'newToOld'},
    { name: 'Old to New', logic: 'oldToNew' },
    { name: 'High to Low', logic:'highToLoW' },
    { name: 'Low to High', logic:'lowToHigh' },
  ]



   
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

    return (
    <View style={styles.container}>
        <Header title={'Filter'} />
        <View style={styles.body }>
            <Text style={{ fontWeight:'bold', backgroundColor:'#F1EBFF', marginBottom:10 }}>Sort</Text>
             <FlatList
                data={sortingOptions}
                renderItem={({item}) => (
                <View style={{ flexDirection:'row', alignItems:'center' }}>
                    <CheckBox
                        title={`${item.name}`}
                        checked={item.name === sortingLogic ? true : false}
                        onPress={() => setSortingLogic(item.name)}
                        containerStyle={{ backgroundColor: 'transparent', padding:0 }}
                        checkedColor="#31BD43"
                        textStyle={{ fontWeight: item.name === sortingLogic ? 'bold' : 'normal' }}
                    />
                </View>
                )}
                keyExtractor={(item, index) => index.toString()}
            />

            <Text style={{ fontWeight:'bold', backgroundColor:'#F1EBFF', marginBottom:10 }}>Instructors</Text>
            <FlatList
                data={instructors}
                renderItem={({item}) => (
                <View style={{ flexDirection:'row', alignItems:'center' }}>
                    <CheckBox
                        title={`${item.name}`}
                        checked={item.isChecked}
                        onPress={() => toggleCheckbox(setInstructors, instructors, item)}
                        textStyle={{ fontWeight: item.isChecked ? 'bold' : 'normal' }}
                        containerStyle={{ backgroundColor: 'transparent', padding:0 }}
                        checkedColor="#31BD43"
                    />
                    {/* <Text>{item.name}</Text> */}
                </View>
                )}
                keyExtractor={item => item.id}
            />

            <Text style={{ fontWeight:'bold', backgroundColor:'#F1EBFF', marginBottom:10 }}>Rating</Text>
            <FlatList
                data={ratings}
                renderItem={({item}) => (
                <View style={{ flexDirection:'row', alignItems:'center' }}>
                    <CheckBox
                        checked={item.isChecked }
                        onPress={() => {
                            toggleCheckbox(setRatings, ratings, item)
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
                    {/* <Text>{item.rating}</Text> */}
                </View>
                )}
                keyExtractor={item => item.id}
            />

            <Text style={{ fontWeight:'bold', backgroundColor:'#F1EBFF', marginBottom:10 }}>Time</Text>
            <FlatList
                data={times}
                renderItem={({item}) => (
                <View style={{ flexDirection:'row', alignItems:'center' }}>
                    <CheckBox
                        checked={item.isChecked}
                        onPress={() => {
                            console.log('pressed!!',item)
                            toggleCheckbox(setTimes, times, item)
                        }}
                        textStyle={{ fontWeight: item.isChecked ? 'bold' : 'normal' }}
                        title={`${item.time}`}
                        containerStyle={{ backgroundColor: 'transparent', padding:0 }}
                        checkedColor="#31BD43"


                    />
                    {/* <Text>{item.time}</Text> */}
                </View>
                )}
                keyExtractor={item => item.id}
            />

            <View style={ styles.pairButtonContainer}>
                <Button 
                    mode='contained' 
                    style={{ backgroundColor:'#A66319' }}
                    labelStyle={{ fontSize: 14 }}
                    onPress={() => navigation.goBack()} 
                >
                        Cancel
                </Button>
                <Button 
                    mode={'contained'}
                    style={{  backgroundColor:'#5F32D1' }}
                    labelStyle={{ fontSize: 14 }}
                    onPress={() => {
                        navigation.navigate('CourseReviews', { courseId: courseId, checkedRatings: ratings, checkedInstructors: instructors, checkedTimes: times, isFiltered: Date.now(), sortingLogic: sortingLogic })
                    }
                }>
                    Apply
                </Button>
            </View>
        </View>
  </View>
  
    )
   
}
const styles = StyleSheet.create({
    ...generalStyles,
})


export default ReviewFilterScreen