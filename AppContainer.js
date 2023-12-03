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

import { rootReducer } from './data/Reducer';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';

import { MaterialIcons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';

const store = configureStore({
    reducer: rootReducer,
});


function MainAppStack() {
    const Tab = createBottomTabNavigator();

    return (
        <Tab.Navigator screenOptions={{ headerShown: false }}>
            <Tab.Screen 
                name="Home" 
                component={HomeTabStack}
                options={{
                    tabBarIcon: ({focused, color, size}) => {
                        return (
                          <Entypo name="home" size={24} color="black" />                      );
                      }
                  }}
                />
            <Tab.Screen 
                name="Account" 
                component={AccountTabStack} 
                options={{
                    tabBarIcon: ({focused, color, size}) => {
                        return (
                          <MaterialIcons name="account-circle" size={24} color="black" />
                        );
                      }
                }}
            />
        </Tab.Navigator>
    );
}

function HomeTabStack() {
    const HomeStack = createNativeStackNavigator();

    return (
        <HomeStack.Navigator initialRouteName='HomePage' screenOptions={{ headerShown: false }}>
            <HomeStack.Screen name='HomePage' component={HomeScreen}/>
            <HomeStack.Screen name='CourseReviews' component={CourseReviewsScreen}/>
            <HomeStack.Screen name='EditReview' component={EditReviewScreen}/>
        </HomeStack.Navigator>
    )
}

function AccountTabStack() {
    const AccountStack = createNativeStackNavigator();

    return (
        <AccountStack.Navigator initialRouteName='AccountPage' screenOptions={{ headerShown: false }}>
            <AccountStack.Screen name='AccountPage' component={AccountScreen}/>
            <AccountStack.Screen name='EditProfile' component={EditProfileScreen}/>
            <AccountStack.Screen name='MyReviews' component={MyReviewsScreen}/>
        </AccountStack.Navigator>
    )
}


function AppContainer() {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const Stack = createNativeStackNavigator();

    return(
        <Provider store={store}>
            <NavigationContainer>
                <Stack.Navigator>
                    <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
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


