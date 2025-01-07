import React from 'react';
import { Alert } from 'react-native';
import * as Zendesk from 'react-native-zendesk-messaging';
import { Button, Section } from '../components';

export function Notifications(): React.ReactElement {
  const handlePressCount = (): void => {
    Zendesk.getUnreadMessageCount()
      .then((count) => Alert.alert(`unread count: ${String(count)}`))
      .catch((error) => console.error(error));
  };

  return (
    <Section title="Notifications" hideSeparator>
      <Button label="Get unread count" onPress={handlePressCount} />
    </Section>
  );
}
