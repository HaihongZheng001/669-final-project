import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { generalStyles } from '../styles/Styles';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '@rneui/themed';
import { MaterialIcons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { deleteReview } from '../data/Actions';
import { useDispatch } from 'react-redux';



export function ReviewCard(props) {
    const { navigation, route, reviewObj, courseObjs, showAnimation } = props
    const courseObj = courseObjs && courseObjs.filter(courseObj => courseObj.id === reviewObj.courseId)[0]
    const dispatch = useDispatch();

    return (

        <View style={styles.reviewCardContainer}>
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#0000ff" animating={showAnimation}/>
            </View>
            {courseObj && 
                // <View style={styles.reviewCardTitleContainer}>
                    <Text style={styles.cardTitleLabel}>{courseObj.name}</Text>
                // </View>
            }

            {reviewObj && 
                <View style={styles.reviewCardDetailContainer}>
                    <View  style={styles.reviewCardDetailTimeContainer}>
                        <Text style={styles.cardDetailTimeLabel}>{reviewObj.term}</Text>
                        <Text style={styles.cardDetailTimeLabel}>{reviewObj.year}</Text>
                    </View>
                    <Text style={styles.cardDetailLabel}>{reviewObj.reviewContent}</Text>
                </View>
            }
            <View style={styles.accountItemContainer}>
                <View style={styles.iconContainerCancel}>
                    <TouchableOpacity
                        onPress={() => {
                            // console.log('rebiew obj to delete',reviewObj)
                            dispatch(deleteReview(reviewObj));
                            // navigation.navigate('HomePage')
                        }}
                    
                    >
                        <MaterialCommunityIcons name="delete" size={22} color="#734109" />
                    </TouchableOpacity>

                </View>

                <View style={styles.iconContainerEdit}>
                    <TouchableOpacity
                        onPress={() => {
                            // console.log('okii!')
                            navigation.navigate('Home', { screen: 'EditReview', params: { reviewObj: reviewObj, prevScreen: 'MyReviews' }})
                    }}
                    >
                        <MaterialIcons name="edit" size={22} color="#4118A8" />
                    </TouchableOpacity>
                    
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    ...generalStyles,
    reviewCardContainer: {
        borderWidth: 1.5,
        // borderColor: '#4118A8',
        marginBottom: '6%',
        // backgroundColor: 'pink',
        borderColor:'#A592D4',
        borderRadius: '8%',
        padding: '4%',
        paddingTop:'0%',
        // paddingBottom: '0%',
    },
    reviewCardTitleContainer: {

    },
    reviewCardDetailContainer: {

    },
    cardTitleLabel: {
        fontWeight: '700',
        marginBottom: '4%',
        color: '#4C338F',
        fontSize: 14,
        // backgroundColor:'green'


    },
    cardDetailLabel: {
        fontSize: 13,
        lineHeight: 20
    },
    reviewCardDetailTimeContainer: {
        flexDirection: 'row',
        marginBottom:'6%'
    },
    parent: {
        flexDirection: 'row',
        justifyContent: 'space-between', 
        alignItems: 'center', 
        // backgroundColor: 'lightblue',
    },
    iconContainerCancel: {
        width: 50,  // Diameter of the circle
        height: 50, // Same as width
        borderRadius: 25, // Half of width/height
        backgroundColor: '#F0D8BD', // Circle color
        justifyContent: 'center', // Center the icon horizontally
        alignItems: 'center',
        marginTop:'4%'
        // backgroundColor:'blue'
    },
    iconContainerEdit: {
        width: 50,  // Diameter of the circle
        height: 50, // Same as width
        borderRadius: 25, // Half of width/height
        backgroundColor: '#E7DBFF', // Circle color
        justifyContent: 'center', // Center the icon horizontally
        alignItems: 'center',
        marginTop:'4%'
        // backgroundColor:'blue'
    },
    itemTitleText: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: '1%'
    },
    itemDetailText: {
    },
    accountItemContainer: {
        flexDirection: 'row',
        marginBottom:'3%',
        marginTop:'3%',
        paddingBottom:'2%',
        justifyContent:'space-evenly'
    },
    cardDetailTimeLabel: {
        marginRight: '1%',
        fontSize: 13,
        color: '#4118A8',
    }

})