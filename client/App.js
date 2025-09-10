import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import PlayerScreen from './screens/PlayerScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{
        headerStyle: { backgroundColor: '#0f172a' },
        headerTintColor: '#fff'
      }}>
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Videos' }} />
        <Stack.Screen name="Player" component={PlayerScreen} options={{ title: 'Player' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
