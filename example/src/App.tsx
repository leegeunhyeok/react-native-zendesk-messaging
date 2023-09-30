import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  ScrollView,
  View,
  Text,
  ActivityIndicator,
} from 'react-native';
import * as Zendesk from 'react-native-zendesk-messaging';
import { Authentication } from './features/Authentication';
import { Chat } from './features/Chat';
import { MetaFields } from './features/MetaFields';
import { MetaTags } from './features/MetaTags';
import { Notifications } from './features/Notifications';

// Enter your Zendesk channel key
const CHANNEL_KEY = 'YOUR_ZENDESK_CHANNEL_KEY_HERE';

const LoadingView = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator color="white" />
  </View>
);

const App = () => {
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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.heading}>Zendesk</Text>
        <Authentication />
        <Chat />
        <MetaFields />
        <MetaTags />
        <Notifications />
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
});

export default App;
