import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon2 from 'react-native-vector-icons/Ionicons';
import HomeScreen from './screens/HomeScreen';
import LoginFace from './screens/LoginFace';
import RegisterFace from './screens/RegisterFace';
import LoginPalm from './screens/LoginPalm';

const StackNavigator = () => {
  const Stack = createNativeStackNavigator();
  const Tab = createBottomTabNavigator();

  function BottomTabs({route}) {
    const user = route.params.user;

    return (
      <Tab.Navigator>
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          initialParams={{user: user}}
          options={{
            tabBarLabel: 'Home',
            headerShown: false,
            tabBarIcon: ({focused}) =>
              focused ? (
                <Icon2 name="notifications" size={30} color="#003580" />
              ) : (
                <Icon2 name="notifications-outline" size={30} />
              ),
          }}
        />
        <Tab.Screen
          name="Book"
          component={HomeScreen}
          initialParams={{user: user}}
          options={{
            tabBarLabel: 'Home',
            headerShown: false,
            tabBarIcon: ({focused}) =>
              focused ? (
                <Icon name="fingerprint" size={30} color="#003580" />
              ) : (
                <Icon name="fingerprint" size={30} />
              ),
          }}
        />
        <Tab.Screen
          name="Profile"
          component={HomeScreen}
          initialParams={{user: user}}
          options={{
            tabBarLabel: 'Profile',
            headerShown: false,
            tabBarIcon: ({focused}) =>
              focused ? (
                <Icon name="account" size={30} color="#003580" />
              ) : (
                <Icon name="account-outline" size={30} />
              ),
          }}
        />
      </Tab.Navigator>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Login"
          component={LoginFace}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Register"
          component={RegisterFace}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Palm"
          component={LoginPalm}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Main"
          component={BottomTabs}
          options={{headerShown: false}}
        />
        {/* <Stack.Screen
          name="Search"
          component={SearchScreen}
          options={{headerShown: false}}
        /> */}
        {/* <Stack.Screen name="Places" component={PlacesScreen} /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNavigator;
