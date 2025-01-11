import React, { useState } from 'react';
import { Alert } from 'react-native';
import * as Zendesk from 'react-native-zendesk-messaging';
import { Button, Gap, Section, TextField } from '../components';

export function Tags(): React.ReactElement {
  const [tag, setTag] = useState('');

  const handlePressSetTags = (): void => {
    if (!tag) {
      console.warn('tag is empty');
      return;
    }

    Zendesk.setConversationTags([tag]);

    Alert.alert(`setConversationTags: ${JSON.stringify([tag])}`);
  };

  const handlePressClearTags = (): void => {
    Zendesk.clearConversationTags();

    Alert.alert('clearConversationTags');
  };

  return (
    <Section title="Tags">
      <TextField value={tag} onChangeText={setTag} placeholder="Tag" />
      <Gap />
      <Button label="Set Tags" onPress={handlePressSetTags} />
      <Gap />
      <Button label="Clear Tags" onPress={handlePressClearTags} />
    </Section>
  );
}
