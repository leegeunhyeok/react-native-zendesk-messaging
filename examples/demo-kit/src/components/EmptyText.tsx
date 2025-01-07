import React from 'react';
import { StyleSheet, Text } from 'react-native';
import type { TextProps } from 'react-native';

export function EmptyText({ children: text }: TextProps): React.ReactElement {
  return (
    <Text style={[styles.text, text ? styles.blueText : styles.emptyText]}>
      {text || '(Empty)'}
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    color: 'black',
  },
  blueText: {
    color: 'dodgerblue',
  },
  emptyText: {
    color: '#ccc',
  },
});
