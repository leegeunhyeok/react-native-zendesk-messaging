import React from 'react';
import * as Zendesk from 'react-native-zendesk-messaging';
import { Button, Section } from '../components';

export function Chat(): React.ReactElement {
  const handlePressOpen = (): void => {
    Zendesk.openMessagingView()
      .then(() => console.log('open messaging view success'))
      .catch((error) => console.error(error));
  };

  return (
    <Section title="Chat">
      <Button label="Open Messaging" onPress={handlePressOpen} />
    </Section>
  );
}
