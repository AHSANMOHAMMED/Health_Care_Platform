import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Screens (to be created)
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import PatientDashboard from './src/screens/PatientDashboard';
import AiChecker from './src/screens/AiChecker';

const Stack = createStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="light" />
        <Stack.Navigator 
          initialRouteName="Login"
          screenOptions={{
            headerShown: false,
            cardStyle: { backgroundColor: '#0A0A0F' }
          }}
        >
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="Dashboard" component={PatientDashboard} />
          <Stack.Screen name="AiChecker" component={AiChecker} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
