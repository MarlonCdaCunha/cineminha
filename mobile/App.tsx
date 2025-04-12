import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'react-native';

// Import screens
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import AddContentScreen from './screens/AddContentScreen';
import EditContentScreen from './screens/EditContentScreen';

// Define the navigation stack parameter list
export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  AddContent: { contentType: 'movie' | 'series' };
  EditContent: { item: any };
};

const Stack = createStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <NavigationContainer>
      <StatusBar barStyle="light-content" backgroundColor="#121212" />
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#121212',
            shadowColor: '#333',
            elevation: 5,
          },
          headerTintColor: '#FFD700',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          cardStyle: { backgroundColor: '#121212' },
        }}
      >
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ title: 'CineMinha' }}
        />
        <Stack.Screen 
          name="AddContent" 
          component={AddContentScreen} 
          options={({ route }) => ({ 
            title: route.params.contentType === 'movie' ? 'Adicionar Filme' : 'Adicionar Série' 
          })}
        />
        <Stack.Screen 
          name="EditContent" 
          component={EditContentScreen} 
          options={{ title: 'Editar Conteúdo' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;