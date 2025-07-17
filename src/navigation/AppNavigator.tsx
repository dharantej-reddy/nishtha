import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS, FONT_SIZES } from '../constants';
import { RootStackParamList, BottomTabParamList } from '../types';

// Import screens
import SplashScreen from '../screens/SplashScreen';
import AuthNavigator from './AuthNavigator';
import HomeScreen from '../screens/main/HomeScreen';
import ExploreScreen from '../screens/main/ExploreScreen';
import LiveScreen from '../screens/main/LiveScreen';
import CommunityScreen from '../screens/main/CommunityScreen';
import ProfileScreen from '../screens/main/ProfileScreen';

// Detail screens
import PlaceDetailsScreen from '../screens/place/PlaceDetailsScreen';
import LiveStreamScreen from '../screens/live/LiveStreamScreen';
import VideoPlayerScreen from '../screens/live/VideoPlayerScreen';
import BookingDetailsScreen from '../screens/booking/BookingDetailsScreen';
import TravelPlanScreen from '../screens/travel/TravelPlanScreen';
import MarketplaceItemScreen from '../screens/marketplace/MarketplaceItemScreen';
import DonationCampaignScreen from '../screens/donation/DonationCampaignScreen';
import CommunityPostScreen from '../screens/community/CommunityPostScreen';

// Drawer screens
import NotificationsScreen from '../screens/main/NotificationsScreen';
import BookingsScreen from '../screens/booking/BookingsScreen';
import MarketplaceScreen from '../screens/marketplace/MarketplaceScreen';
import TravelScreen from '../screens/travel/TravelScreen';
import DonationsScreen from '../screens/donation/DonationsScreen';
import SettingsScreen from '../screens/main/SettingsScreen';
import HelpScreen from '../screens/main/HelpScreen';

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<BottomTabParamList>();
const Drawer = createDrawerNavigator();

// Bottom Tab Navigator
const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string;

          switch (route.name) {
            case 'Home':
              iconName = focused ? 'home' : 'home';
              break;
            case 'Explore':
              iconName = focused ? 'explore' : 'explore';
              break;
            case 'Live':
              iconName = focused ? 'live-tv' : 'live-tv';
              break;
            case 'Community':
              iconName = focused ? 'groups' : 'groups';
              break;
            case 'Profile':
              iconName = focused ? 'person' : 'person-outline';
              break;
            default:
              iconName = 'home';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.gray[500],
        tabBarStyle: {
          backgroundColor: COLORS.white,
          borderTopWidth: 1,
          borderTopColor: COLORS.gray[200],
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: FONT_SIZES.xs,
          fontWeight: '600',
        },
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ title: 'Home' }}
      />
      <Tab.Screen 
        name="Explore" 
        component={ExploreScreen}
        options={{ title: 'Explore' }}
      />
      <Tab.Screen 
        name="Live" 
        component={LiveScreen}
        options={{ title: 'Live' }}
      />
      <Tab.Screen 
        name="Community" 
        component={CommunityScreen}
        options={{ title: 'Community' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
  );
};

// Drawer Navigator
const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      screenOptions={{
        drawerStyle: {
          backgroundColor: COLORS.white,
          width: 280,
        },
        drawerActiveTintColor: COLORS.primary,
        drawerInactiveTintColor: COLORS.gray[600],
        drawerLabelStyle: {
          fontSize: FONT_SIZES.md,
          fontWeight: '600',
        },
        headerStyle: {
          backgroundColor: COLORS.primary,
        },
        headerTintColor: COLORS.white,
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: FONT_SIZES.lg,
        },
      }}
    >
      <Drawer.Screen 
        name="MainTabs" 
        component={TabNavigator}
        options={{ 
          title: 'SacredConnect',
          drawerIcon: ({ color, size }) => (
            <Icon name="home" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen 
        name="Notifications" 
        component={NotificationsScreen}
        options={{
          title: 'Notifications',
          drawerIcon: ({ color, size }) => (
            <Icon name="notifications" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen 
        name="Bookings" 
        component={BookingsScreen}
        options={{
          title: 'My Bookings',
          drawerIcon: ({ color, size }) => (
            <Icon name="event" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen 
        name="Marketplace" 
        component={MarketplaceScreen}
        options={{
          title: 'Marketplace',
          drawerIcon: ({ color, size }) => (
            <Icon name="shopping-bag" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen 
        name="Travel" 
        component={TravelScreen}
        options={{
          title: 'Travel Plans',
          drawerIcon: ({ color, size }) => (
            <Icon name="map" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen 
        name="Donations" 
        component={DonationsScreen}
        options={{
          title: 'Donations',
          drawerIcon: ({ color, size }) => (
            <Icon name="favorite" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{
          title: 'Settings',
          drawerIcon: ({ color, size }) => (
            <Icon name="settings" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen 
        name="Help" 
        component={HelpScreen}
        options={{
          title: 'Help & Support',
          drawerIcon: ({ color, size }) => (
            <Icon name="help" size={size} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

// Main Stack Navigator
const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerStyle: {
            backgroundColor: COLORS.primary,
          },
          headerTintColor: COLORS.white,
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: FONT_SIZES.lg,
          },
          headerBackTitleVisible: false,
        }}
      >
        {/* Splash Screen */}
        <Stack.Screen 
          name="Splash" 
          component={SplashScreen}
          options={{ headerShown: false }}
        />
        
        {/* Authentication */}
        <Stack.Screen 
          name="Auth" 
          component={AuthNavigator}
          options={{ headerShown: false }}
        />
        
        {/* Main App */}
        <Stack.Screen 
          name="Main" 
          component={DrawerNavigator}
          options={{ headerShown: false }}
        />
        
        {/* Detail Screens */}
        <Stack.Screen 
          name="PlaceDetails" 
          component={PlaceDetailsScreen}
          options={{ title: 'Place Details' }}
        />
        
        <Stack.Screen 
          name="LiveStream" 
          component={LiveStreamScreen}
          options={{ 
            title: 'Live Stream',
            headerShown: false, // Full screen for video
          }}
        />
        
        <Stack.Screen 
          name="VideoPlayer" 
          component={VideoPlayerScreen}
          options={{ 
            title: 'Video Player',
            headerShown: false, // Full screen for video
          }}
        />
        
        <Stack.Screen 
          name="BookingDetails" 
          component={BookingDetailsScreen}
          options={{ title: 'Booking Details' }}
        />
        
        <Stack.Screen 
          name="TravelPlan" 
          component={TravelPlanScreen}
          options={{ title: 'Travel Plan' }}
        />
        
        <Stack.Screen 
          name="MarketplaceItem" 
          component={MarketplaceItemScreen}
          options={{ title: 'Product Details' }}
        />
        
        <Stack.Screen 
          name="DonationCampaign" 
          component={DonationCampaignScreen}
          options={{ title: 'Donation Campaign' }}
        />
        
        <Stack.Screen 
          name="CommunityPost" 
          component={CommunityPostScreen}
          options={{ title: 'Community Post' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;