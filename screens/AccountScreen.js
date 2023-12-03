import { Button } from '@rneui/themed';
import { View, Text, StyleSheet, Alert, FlatList, TouchableOpacity } from 'react-native';
import { signOut, getAuthUser } from '../AuthManager';
import { loadUsers, updateUser } from '../data/Actions';


import { useDispatch, useSelector } from 'react-redux';
import React, { useState, useEffect } from 'react';
import { subscribeToUserUpdates } from '../data/Actions';
import { generalStyles } from '../styles/Styles';
import { Header } from '../components/Header';

import { MaterialIcons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { getAuth } from 'firebase/auth';


function AccountScreen(props) {
  const { navigation, route } = props;
  const dispatch = useDispatch();
  const [loginUser, setLoginUser] = useState(null);
  const users = useSelector(state => state.users)

  const [curUser, setCurUser] = useState({})
  // console.log('loginUser', loginUser)
  // console.log('curUser', curUser)


  useEffect(()=>{
    dispatch(loadUsers());
  }, []);

  useEffect(() => {
    const auth = getAuth();
    auth.onAuthStateChanged((user) => {
      setLoginUser(user);
    });
  }, []);

  useEffect(() => {
    // let currentUser;
    // if (loginUser) {
    //   currentUser = users.find(user => user.email === loginUser.email);
    // }
    if (loginUser) {
      setCurUser(users.find(user => user.email === loginUser.email && user.id))
    }
  }, [users, loginUser])

  return (
    <View style={styles.container}>
      <Header title={curUser && curUser.name} showBackButton={false}/>
      <View style={styles.body}>

       <View style={styles.personalInfoContainer}>
        <View style={styles.sectionTitleContainer}>
          <View style={styles.sectionTitleLeft}>
            <Text style={styles.sectionTitleLabel}>Personal Info</Text>
          </View>
          <View style={styles.sectionTitleRight}>
            <TouchableOpacity style={styles.topLeftOpacityContainer} onPress={() => {
                navigation.navigate('EditProfile');
            }}>
              <MaterialIcons name="edit" size={24} color="black" />
            </TouchableOpacity>
          </View>

        </View>

        <View style={styles.accountItemContainer}>
          <View style={styles.iconContainer}>
            <MaterialIcons name="email" size={26} color="black" />
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.itemTitleText}>Email</Text>
            <Text style={styles.itemDetailText}>{curUser && curUser.email}</Text>

          </View>
        </View>

        <View style={styles.accountItemContainer}>
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons name="office-building" size={32} color="black" />
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.itemTitleText}>Department</Text>
            <Text style={styles.itemDetailText}>{curUser && curUser.department}</Text>

          </View>
        </View>

        <View style={styles.accountItemContainer}>
          <View style={styles.iconContainer}>
            <FontAwesome5 name="book-reader" size={24} color="black" />
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.itemTitleText}>Current Major</Text>
            <Text style={styles.itemDetailText}>{curUser && curUser.currentMajor}</Text>
          </View>
        </View>

        <View style={styles.accountItemContainer}>
          <View style={styles.iconContainer}>
            <Ionicons name="school" size={26} color="black" />
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.itemTitleText}>Undergraduate Major</Text>
            <Text style={styles.itemDetailText}>{curUser && curUser.undergraduateMajor}</Text>
          </View>
        </View>

       </View>

       <View style={styles.myReviewsContainer}>
        <View style={styles.sectionTitleContainer}>
            <View style={styles.sectionTitleLeft}>
              <Text style={styles.sectionTitleLabel}>My Reviews</Text>
            </View>
            <View style={styles.sectionTitleRight}></View>
        </View>

        <View style={styles.accountItemContainer}>
          <View style={styles.iconContainer}>
            <MaterialIcons name="rate-review" size={24} color="black" />
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.itemTitleText}>Total Reviews</Text>
            <Text style={styles.itemDetailText}>Click to view details</Text>

          </View>
          <View style={[styles.iconContainer, {backgroundColor: 'white'}]}>
            <Ionicons name="md-chevron-forward" size={24} color="black" />
          </View>
        </View>
          

      </View>
      
        <Button
          style={styles.buttonContainer}
          onPress={async () => {
              try {
                  await signOut();
                  navigation.navigate('Login');
              } catch (error) {
                  Alert.alert("Sign In Error", error.message,[{ text: "OK" }])
              }
          }}
        >
          Sign Out
        </Button>

      </View>
      
    </View>
  );
}

const styles = StyleSheet.create({
  ...generalStyles,
  personalInfoContainer: {
    // backgroundColor: 'grey',
    marginBottom: '4%'

  },
  myReviewsContainer: {

  },
  sectionTitleContainer: {
    flexDirection: 'row',
    marginBottom:'2%'
  },
  sectionTitleLeft: {
    // backgroundColor: 'orange',
    flex: 1
  },
  sectionTitleRight: {
    // backgroundColor: 'pink'
  },
  accountItemContainer: {
    flexDirection: 'row',
    borderBottomColor: 'lightgrey',
    borderBottomWidth: 1,
    paddingBottom: '3%',
    marginBottom:'3%',
    marginTop:'3%'

  },
  iconContainer: {
    width: 50,  // Diameter of the circle
    height: 50, // Same as width
    borderRadius: 25, // Half of width/height
    backgroundColor: 'lightgrey', // Circle color
    justifyContent: 'center', // Center the icon horizontally
    alignItems: 'center', 
  },
  infoContainer: {
    // backgroundColor: 'yellow',
    flex: 1,
    padding: '2%',
    paddingLeft: '4%',
    // justifyContent: 'space-between'
  },
  itemTitleText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: '1%'
  },
  itemDetailText: {
    fontSize: 14
  }



});

export default AccountScreen;
