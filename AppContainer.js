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
import ExpandReviewScreen from "./screens/ExpandReviewScreen";

import { rootReducer } from './data/Reducer';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';

import { MaterialIcons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { FAB } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { View } from "react-native";


const store = configureStore({
    reducer: rootReducer,
});


function MainAppStack() {
    const Tab = createBottomTabNavigator();

    // const iconStyle = (focused) => ({
    //     Color: focused ? '#000' : 'transparent', 
    //     shadowOffshadowset: { width: 0, height: 0 },
    //     shadowOpacity: focused ? 0.3 : 0,
    //     shadowRadius: focused ? 3 : 0,
    //     elevation: focused ? 5 : 0, 
    // });

    return (
        <Tab.Navigator screenOptions={{ headerShown: false, tabBarShowLabel: false }}>
            <Tab.Screen 
                name="Home" 
                component={HomeTabStack}
                listeners={({ navigation }) => ({
                    // focus: () => {
                    //     // Resetting the AccountStack to its first screen when the tab is focused
                    //     navigation.navigate('Home', { screen: 'HomePage' });
                    // },

                    // focus: () => {
                    //     // Check the current state of the stack
                    //     const state = navigation.getState();
                    //     console.log(state.routes)
            
                    //     // Only reset to HomePage if there's only one screen in the stack
                    //     if (state.routes.length === 1) {
                    //         navigation.navigate('Home', { screen: 'HomePage' });
                    //     } 
                    // }

                    // tabPress: (e) => {
                    //     // Prevent default behavior
                    //     e.preventDefault();
                  
                    //     // Navigate based on the current state
                    //     const currentRoute = getFocusedRouteNameFromRoute(route) ?? 'HomePage';
                  
                    //     if (currentRoute === 'HomePage') {
                    //       navigation.navigate('Home', { screen: 'HomePage' });
                    //     } else {
                    //       // Let the Home stack handle the navigation
                    //       navigation.navigate('Home');
                    //     }
                    //   }
                    tabPress: (e) => {
                        // Prevent the default action
                        e.preventDefault();
            
                        // Custom logic or navigation action
                        // console.log('Home tab pressed');
                        navigation.navigate('Home', { screen: 'HomePage'});
                      },

                    // focus: () => {
                    //     const state = navigation.getState();
                    //     // Check if the last route is 'EditReview' and came from 'MyReviews'
                    //     const lastRoute = state.routes[state.index];
                    //     // console.log('lastRoute', lastRoute)
                    //     if (lastRoute.params?.params?.prevScreen === 'MyReviews') {
                    //         // Maintain the current screen
                    //         console.log('lastRoute param from different source', lastRoute.params)
                    //         // navigation.setParams({ prevScreen: undefined });

                    //         return;
                    //     }
                    //     // In other cases, reset to the HomePage

                    //     navigation.navigate('Home', { screen: 'HomePage' });
                    // }
                })}
                options={{
                    tabBarIcon: ({focused, color, size}) => {
                        return (
                        <View>
                          <Entypo name="home" size={24} color={focused ? "#5F32D1" : "#A0A0A0"} /> 
                        </View>
                        );
                      }
                  }}
                />
            <Tab.Screen 
                name="Account" 
                component={AccountTabStack} 
                listeners={({ navigation }) => ({
                    // focus: () => {
                    //     // Resetting the AccountStack to its first screen when the tab is focused
                    //     navigation.navigate('Account', { screen: 'AccountPage' });
                    // },
                    // focus: () => {
                    //     // Check the current state of the stack
                    //     const state = navigation.getState();
            
                    //     // Only reset to HomePage if there's only one screen in the stack
                    //     console.log('account routes', state.rountes)
                    //     if (state.routes.length === 1) {
                    //         navigation.navigate('Account', { screen: 'AccountPage' });
                    //     }
                    // },

                    tabPress: (e) => {
                        // Prevent the default action
                        e.preventDefault();
            
                        // Custom logic or navigation action
                        // console.log('Home tab pressed');
                        navigation.navigate('Account', { screen: 'AccountPage' });
                      },
                })}
                options={{
                    tabBarIcon: ({focused, color, size}) => {
                        return (
                            <View>
                                <Ionicons name="person" size={23} color={focused ? "#5F32D1" : "#A0A0A0"} />
                            </View>

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
            <HomeStack.Screen name='ExpandReview' component={ExpandReviewScreen}/>

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


