import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import * as Zendesk from 'react-native-zendesk-messaging';
import { Section, Button, EmptyText } from './components';

// Enter your Zendesk channel key
const CHANNEL_KEY = 'YOUR_ZENDESK_CHANNEL_KEY_HERE';

const LoadingView = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator color="white" />
  </View>
);

const App = () => {
  const [token, setToken] = useState('');
  const [fieldId, setFieldId] = useState('');
  const [tag, setTag] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Zendesk.initialize({ channelKey: CHANNEL_KEY })
      .then(() => {
        console.log('zendesk initialized');

        Zendesk.addEventListener('authenticationFailed', (event) => {
          console.log('onAuthenticationFailed', event);
        });

        Zendesk.addEventListener('unreadMessageCountChanged', (event) => {
          console.log('onUnreadMessageCountChanged', event);
        });

        setIsLoading(false);
      })
      .catch((error) => console.error(error));
  }, []);

  const handleChangeToken = (text: string) => setToken(text);
  const handleChangeFieldId = (id: string) => setFieldId(id);
  const handleChangeTag = (tag: string) => setTag(tag);

  const runner = async (fn: () => Promise<any>) => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      await fn();
    } catch (error) {
      console.log(error);
      Alert.alert((error as Error)?.message ?? 'unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  // Zendesk methods
  const handlePressLogin = () => runner(() => Zendesk.login(token));
  const handlePressLogout = () => runner(() => Zendesk.logout());
  const handlePressOpen = () => runner(() => Zendesk.openMessagingView());
  const handlePressCount = () => {
    runner(() =>
      Zendesk.getUnreadMessageCount().then((count) =>
        Alert.alert(`unread count: ${count}`)
      )
    );
  };
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
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.heading}>Zendesk</Text>
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
        <Section title="Chat">
          <Button label="Open Messaging" onPress={handlePressOpen} />
        </Section>
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
        <Section title="Notifications" hideSeparator>
          <Button label="Get unread count" onPress={handlePressCount} />
        </Section>
      </ScrollView>
      {isLoading ? <LoadingView /> : null}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,.5)',
  },
  heading: {
    padding: 16,
    fontSize: 36,
    fontWeight: 'bold',
    color: 'black',
  },
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
});

export default App;
