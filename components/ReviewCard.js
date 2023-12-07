import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { generalStyles } from '../styles/Styles';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '@rneui/themed';
import { MaterialIcons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { useState } from 'react';

export function ReviewCard(props) {
    const { navigation, route, reviewObj, courseObjs, showAnimation } = props
    const courseObj = courseObjs && courseObjs.filter(courseObj => courseObj.id === reviewObj.courseId)[0]

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
                <View style={styles.iconContainer}>
                    <TouchableOpacity>
                        <MaterialCommunityIcons name="delete" size={22} color="black" />
                    </TouchableOpacity>

                </View>

                <View style={styles.iconContainer}>
                    <TouchableOpacity>
                        <MaterialIcons name="edit" size={22} color="black" />
                    </TouchableOpacity>
                    
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    ...generalStyles,
    reviewCardContainer: {
        // borderWidth: 1,
        // borderColor: 'lightgrey',
        // borderBottomColor: 'lightgrey',
        marginBottom: '6%',
        backgroundColor: '#FAF6F0',
        // borderRadius: 8,
        padding: '6%',
        paddingTop:'0%'
        // paddingBottom: '0%',
    },
    reviewCardTitleContainer: {

    },
    reviewCardDetailContainer: {

    },
    cardTitleLabel: {
        fontWeight: 'bold',
        marginBottom: '3%',


    },
    cardDetailLabel: {
        fontSize: 13
    },
    reviewCardDetailTimeContainer: {
        flexDirection: 'row',
        marginBottom:'6%'
    },
    parent: {
        flexDirection: 'row',
        justifyContent: 'space-between', 
        alignItems: 'center', 
        backgroundColor: 'lightblue',
    },
    iconContainer: {
        width: 40,  // Diameter of the circle
        height: 40, // Same as width
        borderRadius: 25, // Half of width/height
        backgroundColor: 'lightgrey', // Circle color
        justifyContent: 'center', // Center the icon horizontally
        alignItems: 'center', 
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
    }

})