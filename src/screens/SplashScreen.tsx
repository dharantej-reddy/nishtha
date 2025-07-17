import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Animated,
  Easing,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { StackNavigationProp } from '@react-navigation/stack';
import { COLORS, FONT_SIZES, SPACING } from '../constants';
import { RootStackParamList } from '../types';

const { width, height } = Dimensions.get('window');

type SplashScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Splash'>;

interface Props {
  navigation: SplashScreenNavigationProp;
}

const SplashScreen: React.FC<Props> = ({ navigation }) => {
  const logoAnimation = new Animated.Value(0);
  const titleAnimation = new Animated.Value(0);
  const subtitleAnimation = new Animated.Value(0);
  const loadingAnimation = new Animated.Value(0);

  useEffect(() => {
    StatusBar.setHidden(true);
    startAnimations();
    
    // Navigate to auth screen after 3 seconds
    const timer = setTimeout(() => {
      navigation.replace('Auth');
    }, 3000);

    return () => {
      clearTimeout(timer);
      StatusBar.setHidden(false);
    };
  }, [navigation]);

  const startAnimations = () => {
    // Logo animation
    Animated.timing(logoAnimation, {
      toValue: 1,
      duration: 1000,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();

    // Title animation with delay
    Animated.timing(titleAnimation, {
      toValue: 1,
      duration: 800,
      delay: 500,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();

    // Subtitle animation with delay
    Animated.timing(subtitleAnimation, {
      toValue: 1,
      duration: 800,
      delay: 800,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();

    // Loading animation
    Animated.loop(
      Animated.timing(loadingAnimation, {
        toValue: 1,
        duration: 1500,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      })
    ).start();
  };

  const logoTranslateY = logoAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [50, 0],
  });

  const logoOpacity = logoAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const titleTranslateY = titleAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [30, 0],
  });

  const titleOpacity = titleAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const subtitleTranslateY = subtitleAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [20, 0],
  });

  const subtitleOpacity = subtitleAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const loadingRotation = loadingAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const loadingScale = loadingAnimation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 1.2, 1],
  });

  return (
    <LinearGradient
      colors={COLORS.primaryGradient}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      
      <View style={styles.content}>
        {/* Logo Section */}
        <Animated.View
          style={[
            styles.logoContainer,
            {
              transform: [{ translateY: logoTranslateY }],
              opacity: logoOpacity,
            },
          ]}
        >
          <View style={styles.logoIcon}>
            <Text style={styles.logoEmoji}>🕉️</Text>
          </View>
        </Animated.View>

        {/* Title Section */}
        <Animated.View
          style={[
            styles.titleContainer,
            {
              transform: [{ translateY: titleTranslateY }],
              opacity: titleOpacity,
            },
          ]}
        >
          <Text style={styles.title}>SacredConnect</Text>
        </Animated.View>

        {/* Subtitle Section */}
        <Animated.View
          style={[
            styles.subtitleContainer,
            {
              transform: [{ translateY: subtitleTranslateY }],
              opacity: subtitleOpacity,
            },
          ]}
        >
          <Text style={styles.subtitle}>
            Connecting hearts, minds & souls{'\n'}across sacred spaces worldwide
          </Text>
        </Animated.View>

        {/* Loading Indicator */}
        <View style={styles.loadingContainer}>
          <Animated.View
            style={[
              styles.loadingSpinner,
              {
                transform: [
                  { rotate: loadingRotation },
                  { scale: loadingScale },
                ],
              },
            ]}
          >
            <View style={styles.spinner} />
          </Animated.View>
        </View>
      </View>

      {/* Bottom Section */}
      <View style={styles.footer}>
        <Text style={styles.version}>Version 1.0.0</Text>
        <Text style={styles.copyright}>© 2024 SacredConnect. All rights reserved.</Text>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
  },
  logoContainer: {
    marginBottom: SPACING.xl,
  },
  logoIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  logoEmoji: {
    fontSize: 60,
  },
  titleContainer: {
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: FONT_SIZES.xxxxl,
    fontWeight: 'bold',
    color: COLORS.white,
    textAlign: 'center',
    letterSpacing: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitleContainer: {
    marginBottom: SPACING.xxxl,
  },
  subtitle: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.white,
    textAlign: 'center',
    lineHeight: FONT_SIZES.lg * 1.4,
    opacity: 0.9,
    fontWeight: '300',
  },
  loadingContainer: {
    marginTop: SPACING.xl,
  },
  loadingSpinner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 3,
    borderTopColor: COLORS.white,
    borderRightColor: COLORS.white,
    borderBottomColor: 'transparent',
    borderLeftColor: 'transparent',
  },
  spinner: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 2,
    borderTopColor: COLORS.accent,
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: 'transparent',
  },
  footer: {
    position: 'absolute',
    bottom: SPACING.xl,
    alignItems: 'center',
  },
  version: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.white,
    opacity: 0.7,
    marginBottom: SPACING.xs,
  },
  copyright: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.white,
    opacity: 0.6,
    textAlign: 'center',
  },
});

export default SplashScreen;