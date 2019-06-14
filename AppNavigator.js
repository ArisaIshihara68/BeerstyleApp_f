// tab機能はここ

import React from 'react'
import { Platform } from 'react-native'
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation'
import { Icon } from 'expo'
import HomeScreen from './containers/HomeScreen'
import DetailScreen from './containers/DetailScreen'
import FeedScreen from './containers/FeedScreen'
import FeedEditScreen from './containers/FeedEditScreen'
import ProfileScreen from './containers/ProfileScreen'
import ProfileEditScreen from './containers/ProfileEditScreen'
import MapScreen from './containers/MapScreen'


const HomeStack = createStackNavigator(
  {
    Home: {
      screen: HomeScreen
    },
    Detail: {
      screen: DetailScreen
    },
    Edit: {
      screen: FeedEditScreen
    },
  },
  {
    initialRouteName: 'Home',
    navigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused }) => (
        <Icon.Ionicons
          name={
            Platform.OS === 'ios'
              ? 'ios-home'
              : 'md-home'
          }
          size={26}
          style={{ marginBottom: -3 }}
          color={focused ? 'black' : 'gray'}
        />
      ),
    }),
  }
)

const FeedStack = createStackNavigator(
  {
    Feed: {
      screen: FeedScreen
    },
    Detail: {
      screen: DetailScreen
    },
    Edit: {
      screen: FeedEditScreen
    },
  },
  {
    initialRouteName: 'Feed',
    navigationOptions: {
      tabBarIcon: ({ focused }) => (
        <Icon.Ionicons
          name={
            Platform.OS === 'ios'
              ? 'ios-add'
              : 'md-add'
          }
          size={26}
          style={{ marginBottom: -3 }}
          color={focused ? 'black' : 'gray'}
        />
      ),
    },
  }
)

const MapStack = createStackNavigator(
  {
    Map: {
      screen: MapScreen
    },
  },
  {
    initialRouteName: 'Map',
    navigationOptions: {
      tabBarIcon: ({ focused }) => (
        <Icon.Ionicons
          name={
            Platform.OS === 'ios'
              ? 'ios-map'
              : 'md-map'
          }
          size={26}
          style={{ marginBottom: -3 }}
          color={focused ? 'black' : 'gray'}
        />
      ),
    },
  }
)

const ProfileStack = createStackNavigator(
  {
    Profile: {
      screen: ProfileScreen
    },
    Edit: {
      screen: ProfileEditScreen
    },
  },
  {
    initialRouteName: 'Profile',
    navigationOptions: {
      tabBarIcon: ({ focused }) => (
        <Icon.Ionicons
          name={
            Platform.OS === 'ios'
              ? 'ios-person'
              : 'md-person'
          }
          size={26}
          style={{ marginBottom: -3 }}
          color={focused ? 'black' : 'gray'}
        />
      ),
    },
  }
)

const TabNavigator = createBottomTabNavigator(
  {
    Home: HomeStack,
    Feed: FeedStack,
    Map: MapStack,
    Profile: ProfileStack,

  },
  {
    tabBarOptions: {
      activeTintColor: 'black',
      inactiveTintColor: 'gray',
    }
  }
)

export default TabNavigator