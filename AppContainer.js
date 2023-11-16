//@ React Navigation: https://reactnavigation.org/docs/nesting-navigators/#navigating-to-a-screen-in-a-nested-navigator.

import { NavigationContainer} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useState } from "react";


import HomeScreen from './screens/HomeScreen';
import CourseReviewsScreen from './screens/CourseReviewsScreen';
import EditReviewScreen from './screens/EditReviewScreen';
import AccountScreen from './screens/AccountScreen';
import EditProfileScreen from './screens/EditProfileScreen';
import MyReviewsScreen from './screens/MyReviewsScreen';
import LoginScreen from './screens/LoginScreen';
import SignUpScreen from './screens/SignUpScreen';


import { rootReducer } from './data/Reducer';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';

import { MaterialIcons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';

const store = configureStore({
    reducer: rootReducer,
});

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const InnerStack = createNativeStackNavigator();


function MainAppStack() {
    return (
        <Tab.Navigator screenOptions={{ headerShown: false }}>
            <Tab.Screen 
                name="Home" 
                component={HomeTabStack}
                options={{
                    tabBarIcon: ({focused, color, size}) => {
                      return (
                        <MaterialIcons name="account-circle" size={24} color="black" />
                      );
                    }
                  }}
                />
            <Tab.Screen 
                name="Account" 
                component={AccountTabStack} 
                options={{
                    tabBarIcon: ({focused, color, size}) => {
                      return (
                        <Entypo name="home" size={24} color="black" />                      );
                    }
                }}
            />
        </Tab.Navigator>
    );
}

function HomeTabStack() {
    return (
        <InnerStack.Navigator initialRouteName='HomePage' screenOptions={{ headerShown: false }}>
            <Stack.Screen name='HomePage' component={HomeScreen}/>
            <Stack.Screen name='CourseReviews' component={CourseReviewsScreen}/>
            <Stack.Screen name='EditRview' component={EditReviewScreen}/>
        </InnerStack.Navigator>
    )
}

function AccountTabStack() {
    return (
        <InnerStack.Navigator initialRouteName='AccountPage' screenOptions={{ headerShown: false }}>
            <Stack.Screen name='AccountPage' component={AccountScreen}/>
            <Stack.Screen name='EditProfile' component={EditProfileScreen}/>
            <Stack.Screen name='MyReviews' component={MyReviewsScreen}/>
        </InnerStack.Navigator>
    )
}


function AppContainer() {
    const [isAuthenticated, setIsAuthenticated] = useState(false)

    return(
        <Provider store={store}>
            <NavigationContainer>
                <Stack.Navigator>
                    <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
                    <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: false }} />
                    <Stack.Screen
                        name="MainApp"
                        component={MainAppStack}
                        options={{ headerShown: false }}
                    />
                    
                </Stack.Navigator>
            </NavigationContainer>
        </Provider>
    );
  }
  
  export default AppContainer;

  // function AuthStack() {
//     return (
//         <Stack.Navigator initialRouteName='Login' screenOptions={{ headerShown: false }}>
//           <Stack.Screen name="Login" component={LoginScreen} />
//           <Stack.Screen name="SignUp" component={SignUpScreen} />
//         </Stack.Navigator>
//       );
// }

// function MainAppStack() {
//     return (
//         <Tabs.Navigator >
//                 <Tabs.Screen name="Home" component={HomeTabStack} />
//                 <Tabs.Screen name="Profile" component={AccountTabStack} />
//         </Tabs.Navigator>
//     )
// }


