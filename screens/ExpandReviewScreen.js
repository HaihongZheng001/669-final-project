import React, {useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, ScrollView } from 'react-native';
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

function ExpandReviewScreen(props) {
    const { navigation, route } = props;
    const { courseObj, reviewObj, userObj } = route.params || {};

    return (
    

        <View style={styles.container}>
            <Header title={`${userObj?.name}'s Review`} showBackButton={true} navigation={navigation}/>
            <View style={styles.body}>
                <View style={styles.fixedContent}>
                    <Text style={styles.courseName}>{courseObj?.name}</Text>
                    <View style={styles.timeInfoContainer}> 
                        <Text>{reviewObj?.term} </Text>
                        <Text>{reviewObj?.year}</Text>
                        <View style={styles.ratingContainer}>
                                <Text>Rating: </Text>

                                <StarRating
                                    rating={reviewObj?.rating}
                                    onChange={() => {}}
                                    starSize={20}
                                    color='#FFCF00'
                                    starStyle={{ marginLeft: 0}}
                                />
                            <Text>{reviewObj?.rating} / 5</Text>
                        </View>
                    </View>
                </View>

                <ScrollView style={styles.scrollableContent}>
                    <Text style={styles.reviewContent}>
                        {reviewObj ? reviewObj.reviewContent : 'No details available'}
                    </Text>
                </ScrollView>
            </View>
        </View>



    )
}


const styles = StyleSheet.create({
    ...generalStyles,
    timeInfoContainer: {
        marginTop: '6%',
        marginBottom:'6%',
        flexDirection:'row',
        backgroundColor:'#FFF3D4'
    },
    courseName: {
        fontWeight:'bold'
    },
    ratingContainer: {
        flexDirection:'row',
        marginLeft:'6%'
    },
    fixedContent: {
        // Styles for the fixed content section
    },
    scrollableContent: {
        // Styles for the scrollable content section
    },
    

    reviewContent: {
       lineHeight:20,
        // Styles for review content text
    },
   
   });
   
   export default ExpandReviewScreen;