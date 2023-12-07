import React, {useState, useEffect} from 'react';
import { View, Text, StyleSheet, FlatList , TouchableOpacity } from 'react-native';
import { Header } from '../components/Header';
import { generalStyles } from '../styles/Styles';
import { useSelector, useDispatch } from 'react-redux';
import { loadCourses, loadLoginUserReviews } from '../data/Actions';
import { getAuth } from 'firebase/auth';
import { ReviewCard } from '../components/ReviewCard';
import { ScrollView } from 'react-native-web';


function MyReviewsScreen(props) {
  const { navigation, route } = props
  const [loadedCourses, setLoadedCourses] = useState([])
  const [loginUser, setLoginUser] = useState(null);
  const [loginUserReviews, setLoginUserReviews] = useState([])
  const [showAnimation, setShowAnimation] = useState(false)



  const dispatch = useDispatch();

  const initLoginUserReviews = useSelector(state => {
    return state.loginUserReviews
  })

  const courses = useSelector(state => {
    return state.courses
  })


  useEffect(()=>{
     if (loginUser) {
      dispatch(loadLoginUserReviews(loginUser.uid))
     } 
  }, [loginUser]);

  useEffect(() => {
    if (initLoginUserReviews) {
      setLoginUserReviews(initLoginUserReviews)
    }
  }, [initLoginUserReviews])
 

  useEffect(() => {
    dispatch(loadCourses())
    const auth = getAuth();
    auth.onAuthStateChanged((user) => {
      // console.log('!!auth user in review page', user)
      setLoginUser(user);
    });
  }, []);


  return (
    <View style={styles.container}>
      <Header title={'My Reviews'} showBackButton={true} navigation={navigation}/>
      <View style={styles.body}>
        {/* {console.log('!!loginUserReviews', loginUserReviews.length)} */}

        {loginUserReviews && loginUserReviews.length > 0 && 
          <FlatList
            data={loginUserReviews} // Provide the data source
            renderItem={({ item }) => (
                // <Text>{item.reviewContent}</Text>
                <ReviewCard navigation={navigation} reviewObj={item} courseObjs={courses} showAnimation={showAnimation}/>

            )}
            keyExtractor={(item) => item.id} // Provide a unique key for each item
          />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  ...generalStyles,

});

export default MyReviewsScreen;
