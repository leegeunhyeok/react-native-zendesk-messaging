import React from 'react';
import * as Zendesk from 'react-native-zendesk-messaging';
import { Button, Section } from '../components';

export function Chat() {
  const handlePressOpen = () => Zendesk.openMessagingView();

  return (
    <Section title="Chat">
      <Button label="Open Messaging" onPress={handlePressOpen} />
    </Section>
  );
}
