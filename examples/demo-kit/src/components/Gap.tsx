import React from 'react';
import { StyleSheet, View } from 'react-native';

export function Gap(): React.ReactElement {
  return <View style={styles.gap} />;
}

const styles = StyleSheet.create({
  gap: {
    height: 16,
  },
});
