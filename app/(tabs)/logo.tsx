import React, { useEffect } from 'react';
import {
  View,
  Image,
  StyleSheet,
  Animated,
} from 'react-native';

const MovingLogo = () => {
  const animation = new Animated.Value(0);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animation, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(animation, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [animation]);

  const translateY = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -20], // Gerakan naik-turun sebesar 20 piksel
  });

  return (
    <View style={styles.container}>
      <Animated.View style={{ transform: [{ translateY }] }}>
        <Image source={require('../../assets/images/logo.png')} style={styles.logo} />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  logo: {
    width: 350,
    height: 350,
  },
});

export default MovingLogo;