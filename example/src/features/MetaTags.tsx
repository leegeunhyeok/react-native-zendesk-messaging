import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Alert } from 'react-native';
import * as Zendesk from 'react-native-zendesk-messaging';
import { Button, Section } from '../components';

export function MetaTags() {
  const [tag, setTag] = useState('');

  const handleChangeTag = (tag: string) => setTag(tag);

  const handlePressSetTags = () => {
    if (!tag) {
      console.warn('tag is empty');
      return;
    }
    Zendesk.setConversationTags([tag]);
    Alert.alert('setConversationTags: ' + JSON.stringify([tag]));
  };

  const handlePressClearTags = () => {
    Zendesk.clearConversationTags();
    Alert.alert('clearConversationTags');
  }

  return (
    <Section title="Tags">
      <TextInput
        value={tag}
        onChangeText={handleChangeTag}
        style={styles.textInput}
        placeholder="Tag"
      />
      <View style={styles.gap} />
      <Button label="Set Tags" onPress={handlePressSetTags} />
      <View style={styles.gap} />
      <Button label="Clear Tags" onPress={handlePressClearTags} />
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
  gap: {
    marginTop: 8,
  },
})
