import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Alert } from 'react-native';
import * as Zendesk from 'react-native-zendesk-messaging';
import { Button, Section } from '../components';

export function MetaFields() {
  const [fieldId, setFieldId] = useState('');

  const handleChangeFieldId = (id: string) => setFieldId(id);

  const handlePressSetFields = () => {
    if (!fieldId) {
      console.warn('field id is empty');
      return
    }
    Zendesk.setConversationFields({ [fieldId]: 'react-native-zendesk-messaging' });
    Alert.alert('setConversationFields: ' + fieldId);
  };

  const handlePressClearFields = () => {
    Zendesk.clearConversationFields();
    Alert.alert('clearConversationFields');
  }

  return (
    <Section title="Fields">
      <TextInput
        value={fieldId}
        onChangeText={handleChangeFieldId}
        style={styles.textInput}
        placeholder="Field id"
      />
      <View style={styles.gap} />
      <Button label="Set Fields" onPress={handlePressSetFields} />
      <View style={styles.gap} />
      <Button label="Clear Fields" onPress={handlePressClearFields} />
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
