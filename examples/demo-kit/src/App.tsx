import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  StyleSheet,
  Platform,
} from 'react-native';
import { LoadingView } from './components';
import { Authentication } from './features/Authentication';
import { Chat } from './features/Chat';
import { Fields } from './features/Fields';
import { Tags } from './features/Tags';
import { Notifications } from './features/Notifications';
import { useZendesk } from './hooks/useZendesk';

const channelKey = Platform.select({
  ios: '<IOS_CHANNEL_KEY>',
  android: '<ANDROID_CHANNEL_KEY>',
  default: '',
});

export function App(): React.ReactElement {
  const { isReady } = useZendesk({
    channelKey,
    onInitialized() {
      console.log('Zendesk initialized');
    },
    onError: (error) => {
      console.log(error);
    },
  });

  return (
    <SafeAreaView>
      <ScrollView>
        <Text style={styles.heading}>Zendesk</Text>
        <Authentication />
        <Chat />
        <Fields />
        <Tags />
        <Notifications />
      </ScrollView>
      {isReady ? null : <LoadingView />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  heading: {
    padding: 16,
    fontSize: 36,
    fontWeight: 'bold',
    color: 'black',
  },
});
