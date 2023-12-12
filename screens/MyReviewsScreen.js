import React, {useState, useEffect} from 'react';
import { View, Text, StyleSheet, FlatList , TouchableOpacity, Image } from 'react-native';
import { Header } from '../components/Header';
import { generalStyles } from '../styles/Styles';
import { useSelector, useDispatch } from 'react-redux';
import { loadCourses, loadReviews } from '../data/Actions';
import { getAuth } from 'firebase/auth';
import { ReviewCard } from '../components/ReviewCard';
import { ScrollView } from 'react-native-web';
import { Skeleton } from '@rneui/themed';
import { Button } from 'react-native-paper';
import smile from '../assets/smile.png';

function MyReviewsScreen(props) {
  const { navigation, route } = props
  const [loadedCourses, setLoadedCourses] = useState([])
  const [loginUser, setLoginUser] = useState(null);
  const [loginUserReviews, setLoginUserReviews] = useState([])
  const [showAnimation, setShowAnimation] = useState(false)

  const dispatch = useDispatch();

  // const initLoginUserReviews = useSelector(state => {
  //   return state.loginUserReviews
  // })

  const allReviews = useSelector(state => {
    return state.reviews
  })

  const courses = useSelector(state => {
    return state.courses
  })

  useEffect(() => {
    dispatch(loadReviews())
  }, [allReviews])

  useEffect(()=>{
     if (loginUser && allReviews) {
      const filteredReviews = allReviews.filter(review => review.userUid == loginUser.uid);
      // console.log('hha', filteredReviews)
      setLoginUserReviews(filteredReviews)
     } 
  }, [loginUser, allReviews]);



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
      
        {
          loginUserReviews && loginUserReviews.length > 0 ? 
          <FlatList
            data={loginUserReviews} // Provide the data source
            renderItem={({ item }) => (
                // <Text>{item.reviewContent}</Text>
                <ReviewCard navigation={navigation} reviewObj={item} courseObjs={courses} showAnimation={showAnimation}/>

            )}
            keyExtractor={(item) => item.id} // Provide a unique key for each item
          />
           :
           (loginUserReviews && loginUserReviews.length === 0 ? 
              (<View style={styles.body}>
                  {/* <Text style={{ fontSize: 18, marginBottom: '10%', marginTop:'30%' }}>You don't have any reviews...</Text> */}
                  <View style={{ alignItems:'center' }}>
                    <Image source={smile} style={{ width: 300, height:300, marginBottom:'2%' }}/>

                    <Button mode='contained' style={{  backgroundColor:'#5F32D1' }} onPress={() => navigation.navigate('EditReview', { screen: 'MyReviews' })}>Write a Review</Button>
                  </View>
                </View>)
                
                :
              (<View>
                  <Skeleton width={'100%'} height={230} backgroundColor='#EAE1FC' borderRadius={6} marginBottom={20} skeletonStyle={{ backgroundColor:'#F8F5FF' }} />
                  <Skeleton width={'100%'} height={230} backgroundColor='#EAE1FC' borderRadius={6} marginBottom={20} skeletonStyle={{ backgroundColor:'#F8F5FF' }} />
                  <Skeleton width={'100%'} height={230} backgroundColor='#EAE1FC' borderRadius={6} marginBottom={20} skeletonStyle={{ backgroundColor:'#F8F5FF' }} />
                </View>) )
           
          // <View>
          //   <Skeleton style={styles.stack} animation="waive" width={335} height={180} />
          //   <Skeleton style={styles.stack} animation="pulse" width={335} height={180} />
          //   <Skeleton style={styles.stack} animation="pulse" width={335} height={180} />
          // </View>
        //   <FlatList
        //   data={loginUserReviews} // Provide the data source
        //   renderItem={({ item }) => (
        //       // <Text>{item.reviewContent}</Text>
        //       <ReviewCard navigation={navigation} reviewObj={item} courseObjs={courses} showAnimation={showAnimation}/>

        //   )}
        //   keyExtractor={(item) => item.id} // Provide a unique key for each item
        // />

        }
       
        {/* {console.log('!!loginUserReviews', loginUserReviews.length)} */}

        {/* {loginUserReviews && loginUserReviews.length > 0 && 
          <FlatList
            data={loginUserReviews} // Provide the data source
            renderItem={({ item }) => (
                // <Text>{item.reviewContent}</Text>
                <ReviewCard navigation={navigation} reviewObj={item} courseObjs={courses} showAnimation={showAnimation}/>

            )}
            keyExtractor={(item) => item.id} // Provide a unique key for each item
          />} */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  ...generalStyles,
  stack: {
    marginBottom: '10%',
  }

});

export default MyReviewsScreen;
