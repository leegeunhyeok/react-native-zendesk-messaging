import React from 'react';
import { TextInput, StyleSheet, type TextInputProps } from 'react-native';

export function TextField(
  props: Omit<TextInputProps, 'style'>
): React.ReactElement {
  return <TextInput {...props} style={styles.textInput} />;
}

const styles = StyleSheet.create({
  textInput: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 2,
    borderColor: 'black',
    borderRadius: 50,
    color: 'black',
  },
});
