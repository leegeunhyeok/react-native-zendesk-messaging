import React from 'react';
import { StyleSheet, Pressable, Text } from 'react-native';
import type { PressableProps } from 'react-native';

interface ButtonProps extends Omit<PressableProps, 'children'> {
  label: string;
}

export const Button = ({ label, ...restProps }: ButtonProps) => (
  <Pressable style={styles.button} {...restProps}>
    <Text style={styles.buttonLabel}>{label}</Text>
  </Pressable>
);

const styles = StyleSheet.create({
  button: {
    alignSelf: 'baseline',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#333',
    borderRadius: 50,
  },
  buttonLabel: {
    color: 'white',
    fontSize: 16,
  },
});
