import * as Zendesk from 'react-native-zendesk-messaging';
import React, { useState } from 'react';
import { Text, StyleSheet } from 'react-native';
import { Button, Section, EmptyText, TextField, Gap } from '../components';

export function Authentication(): React.ReactElement {
  const [token, setToken] = useState('');

  const handlePressLogin = (): void => {
    Zendesk.login(token)
      .then(() => console.log('login success'))
      .catch((error) => console.error(error));
  };

  const handlePressLogout = (): void => {
    Zendesk.logout()
      .then(() => console.log('logout success'))
      .catch((error) => console.error(error));
  };

  return (
    <Section title="User Authentication">
      <TextField
        value={token}
        onChangeText={setToken}
        placeholder="User token"
      />
      <Gap />
      <Text style={styles.text}>
        {'User token: '}
        <EmptyText>{token}</EmptyText>
      </Text>
      <Gap />
      <Button label="Login" onPress={handlePressLogin} />
      <Gap />
      <Button label="Logout" onPress={handlePressLogout} />
    </Section>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    color: 'black',
  },
});
