// import AppContainer from './AppContainer';


// export default function App() {
//   return (
//     <AppContainer/>
//   );
// }



import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from './data/Reducer';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';


const store = configureStore({
  reducer: rootReducer, 
});

function App() {
  const Stack = createNativeStackNavigator();

  return (

    <Provider store={store}>

      <NavigationContainer>
        <Stack.Navigator initialRouteName='Login' 
          screenOptions={{ headerShown: false }}>
          <Stack.Screen name='Login' component={LoginScreen}/>
          <Stack.Screen name='Home' component={HomeScreen}/>
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>

  );
}
export default App;