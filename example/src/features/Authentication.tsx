import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Text } from 'react-native';
import * as Zendesk from 'react-native-zendesk-messaging';
import { Button, EmptyText, Section } from '../components';

export function Authentication() {
  const [token, setToken] = useState('');

  const handleChangeToken = (text: string) => setToken(text);
  const handlePressLogin = () => Zendesk.login(token);
  const handlePressLogout = () => Zendesk.logout();

  return (
    <Section title="User Authentication">
      <TextInput
        value={token}
        onChangeText={handleChangeToken}
        style={styles.textInput}
        placeholder="User token"
      />
      <View style={styles.gap} />
      <Text style={styles.text}>
        {'User token: '}
        <EmptyText>{token}</EmptyText>
      </Text>
      <View style={styles.gap} />
      <Button label="Login" onPress={handlePressLogin} />
      <View style={styles.gap} />
      <Button label="Logout" onPress={handlePressLogout} />
    </Section>
  );
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
  text: {
    fontSize: 16,
    color: 'black',
  },
  gap: {
    marginTop: 8,
  },
})
