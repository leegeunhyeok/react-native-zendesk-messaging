import React from 'react';
import { StyleSheet, Pressable, Text, type PressableProps } from 'react-native';

interface ButtonProps extends Omit<PressableProps, 'children'> {
  label: string;
}

export function Button({
  label,
  ...restProps
}: ButtonProps): React.ReactElement {
  return (
    <Pressable style={styles.button} {...restProps}>
      <Text style={styles.buttonLabel}>{label}</Text>
    </Pressable>
  );
}

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
