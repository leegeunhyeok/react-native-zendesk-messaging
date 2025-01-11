import React, { useState } from 'react';
import { Alert } from 'react-native';
import * as Zendesk from 'react-native-zendesk-messaging';
import { Button, Gap, Section, TextField } from '../components';

export function Fields(): React.ReactElement {
  const [fieldId, setFieldId] = useState('');

  const handlePressSetFields = (): void => {
    if (!fieldId) {
      console.warn('field id is empty');
      return;
    }

    Zendesk.setConversationFields({
      [fieldId]: 'react-native-zendesk-messaging',
    });

    Alert.alert(`setConversationFields: ${fieldId}`);
  };

  const handlePressClearFields = (): void => {
    Zendesk.clearConversationFields();

    Alert.alert('clearConversationFields');
  };

  return (
    <Section title="Fields">
      <TextField
        value={fieldId}
        onChangeText={setFieldId}
        placeholder="Field id"
      />
      <Gap />
      <Button label="Set Fields" onPress={handlePressSetFields} />
      <Gap />
      <Button label="Clear Fields" onPress={handlePressClearFields} />
    </Section>
  );
}
