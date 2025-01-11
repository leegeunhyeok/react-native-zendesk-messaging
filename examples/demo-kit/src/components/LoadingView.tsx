import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

export function LoadingView(): React.ReactElement {
  return (
    <View style={styles.container}>
      <ActivityIndicator color="white" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,.5)',
  },
});
