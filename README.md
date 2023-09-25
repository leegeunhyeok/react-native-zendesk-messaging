<div align="center">

  # react-native-zendesk-messaging

  <img width="300" alt="zendesk" src="https://user-images.githubusercontent.com/26512984/207395088-5b4bd509-c68e-4cd0-9c98-0162f23ff713.png">

  [Zendesk messaging SDK](https://developer.zendesk.com/documentation/zendesk-web-widget-sdks) for React Native

  [![style](https://img.shields.io/badge/vercel%20code--style-000000?logo=vercel&logoColor=white)](https://github.com/vercel/style-guide)
  [![ktlint](https://img.shields.io/badge/ktlint%20code--style-%E2%9D%A4-FF4081)](https://pinterest.github.io/ktlint)
  [![swiftlint](https://img.shields.io/badge/swiftlint%20code--style-%E2%9D%A4-51A0D5)](https://github.com/realm/SwiftLint)
  [![npm version](https://badge.fury.io/js/react-native-zendesk-messaging.svg)](https://badge.fury.io/js/react-native-zendesk-messaging)

</div>

## Features

- 🔥 Not a Classic SDKs. It's new SDKs
- 🗣️ Basic conversation features
- 🔔 Push Notifications
  - support native customizing or integrate with [@react-native-firebase/messaging](https://rnfirebase.io/reference/messaging)
- ✅ Support SDK events
- 🔑 User Authentication
- 🚗 Visitor Path
- 📝 Conversation Metadata(fields and tags)

Read official announcement about new messaging SDKs [here](https://support.zendesk.com/hc/en-us/articles/4408882490778).

## Installation

```sh
npm install react-native-zendesk-messaging
# or
yarn add react-native-zendesk-messaging
```

## Getting Started

Read [Getting Started Guide](./docs/getting-started.md).

## Usage

```js
import React, { useEffect } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  Pressable,
  Text
} from 'react-native';
import * as Zendesk from 'react-native-zendesk-messaging';

const CHANNEL_KEY = 'YOUR_ZENDESK_CHANNEL_KEY';

function App() {
  useEffect(() => {
    Zendesk.initialize({ channelKey: CHANNEL_KEY })
      .then(() => /* success */)
      .catch((error) => /* failure */);
  }, []);

  const handlePressOpenButton = () => {
    Zendesk.openMessagingView();
  };

  return (
    <SafeAreaView style={styles.container}>
      <Pressable onPress={handlePressOpenButton}>
        <Text>Open Messaging</Text>
      </Pressable>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
```

For more details, Read the [API References](./docs/apis.md).

If you're interested in contributing, check out the [Contributing Guide](CONTRIBUTING.md).

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

[MIT](./LICENSE)

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
