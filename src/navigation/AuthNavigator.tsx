import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { COLORS, FONT_SIZES } from '../constants';

// Import auth screens
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';
import VerifyEmailScreen from '../screens/auth/VerifyEmailScreen';
import OnboardingScreen from '../screens/auth/OnboardingScreen';

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  VerifyEmail: { email: string };
  Onboarding: undefined;
};

const Stack = createStackNavigator<AuthStackParamList>();

const AuthNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerStyle: {
          backgroundColor: COLORS.primary,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: COLORS.white,
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: FONT_SIZES.lg,
        },
        headerBackTitleVisible: false,
        cardStyle: {
          backgroundColor: COLORS.white,
        },
      }}
    >
      <Stack.Screen 
        name="Login" 
        component={LoginScreen}
        options={{ 
          headerShown: false,
        }}
      />
      
      <Stack.Screen 
        name="Register" 
        component={RegisterScreen}
        options={{ 
          title: 'Create Account',
          headerShown: true,
        }}
      />
      
      <Stack.Screen 
        name="ForgotPassword" 
        component={ForgotPasswordScreen}
        options={{ 
          title: 'Reset Password',
          headerShown: true,
        }}
      />
      
      <Stack.Screen 
        name="VerifyEmail" 
        component={VerifyEmailScreen}
        options={{ 
          title: 'Verify Email',
          headerShown: true,
          headerLeft: () => null, // Prevent going back
        }}
      />
      
      <Stack.Screen 
        name="Onboarding" 
        component={OnboardingScreen}
        options={{ 
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default AuthNavigator;