import React from 'react';
import { Alert } from 'react-native';
import * as Zendesk from 'react-native-zendesk-messaging';
import { Button, Section } from '../components';

export function Notifications() {
  const handlePressCount = () => {
    Zendesk.getUnreadMessageCount().then((count) => {
      Alert.alert(`unread count: ${count}`);
    });
  };

  return (
    <Section title="Notifications" hideSeparator>
      <Button label="Get unread count" onPress={handlePressCount} />
    </Section>
  );
}
