import React from 'react';
import { SafeAreaView, ScrollView, Text, StyleSheet } from 'react-native';
import { LoadingView } from './components';
import { Authentication } from './features/Authentication';
import { Chat } from './features/Chat';
import { Fields } from './features/Fields';
import { Tags } from './features/Tags';
import { Notifications } from './features/Notifications';
import { useZendesk } from './hooks/useZendesk';

export function App(): React.ReactElement {
  const { isReady } = useZendesk({
    channelKey: '',
    onInitialized() {
      console.log('Zendesk initialized');
    },
    onError: (error) => {
      console.log(error);
    },
  });

  if (!isReady) {
    return <LoadingView />;
  }

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
