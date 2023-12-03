import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Button } from '@rneui/themed';
import { generalStyles } from '../styles/Styles';
import { Header } from '../components/Header';
import { subscribeToAuthChanges } from '../AuthManager';
import SelectDropdown from 'react-native-select-dropdown'


function EditReviewScreen(props) {
  const { navigation, route } = props
  // useEffect(()=> {
  //   subscribeToAuthChanges(navigation);
  // }, []);

  // useEffect(()=>{
  //   console.log("navigation",navigation)
  // }
  // ,[navigation])
  const [courseName, setCourseName] = useState('');
  const [year, setYear] = useState('');
  const [term, setTerm] = useState('');
  const [instructor, setInstructor] = useState('');
  const [rating, setRating] = useState('');
  const [review, setReview] = useState('');

  const countries = ["Egypt", "Canada", "Australia", "Ireland"]




  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>

    <KeyboardAvoidingView 
      behavior='padding'
      keyboardVerticalOffset={350}
      style={styles.container}
    >
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
              onChangeText={text=>setCourseName(text)}
              value={courseName}
            />
          </View>
        </View>

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
                keyboardType="numeric"
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
                onChangeText={text=>setTerm(text)}
                value={term}
              />
            </View>
          </View>
          
        </View>

        <View style={styles.listItemContainer}>
          <View style={styles.labelContainer}>
            <Text style={styles.labelText}>Instructor</Text>
          </View>
          <View style={styles.inputContainer}>
            <TextInput 
              style={styles.inputBox}
              autoCapitalize='none'
              spellCheck={false}
              onChangeText={text=>setInstructor(text)}
              value={instructor}
            />
          </View>
        </View>

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
              keyboardType="numeric"
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
              onChangeText={text=>setReview(text)}
              value={review}
              multiline
              textAlign="left"
              textAlignVertical="top"
            />
          </View>
        </View>


        <View style={styles.buttonContainer}>
          <Button
            onPress={() =>{
              console.log()
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
        {/* </TouchableWithoutFeedback> */}
      {/* </KeyboardAvoidingView> */}
      </View>
    </KeyboardAvoidingView>
    </TouchableWithoutFeedback>

  );
}

const styles = StyleSheet.create({
 ...generalStyles
});

export default EditReviewScreen;
