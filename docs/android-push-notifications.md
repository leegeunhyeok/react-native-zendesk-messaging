# Push Notifications for Android

- [Firebase Cloud Messaging](#firebase-cloud-messaging)
  - [Basic setup](#basic-setup)
  - [Implementation of FirebaseMessagingService](#implementation-of-firebasemessagingservice)
- [Integrate with @react-native-firebase/messaging](#integrate-with-react-native-firebasemessaging)

## Firebase Cloud Messaging

> ⚠️ Are you using [@react-native-firebase/messaging](https://rnfirebase.io/messaging/usage)?
>
> Go to [Integrate with react-native-firebase](#integrate-with-react-native-firebase) section.

### Basic setup

Follow [official guide](https://developer.zendesk.com/documentation/zendesk-web-widget-sdks/sdks/android/push_notifications) (Step 1~3)

- Step 1 - Setting up push notifications in Firebase
- Step 2 - Adding your Firebase key and ID in the Zendesk Admin Center
- Step 3 - Implementing push notifications in your app's codebase
  - ~~Using the default implementation of FirebaseMessagingService~~ (not support in this library)
  - Using a custom implementation of FirebaseMessagingService

### Implementation of FirebaseMessagingService

- Kotlin
  ```kotlin
  import com.google.firebase.messaging.FirebaseMessagingService
  import dev.geundung.zendesk.messaging.ZendeskNativeModule

  // Your FirebaseMessagingService
  class SampleMessagingService : FirebaseMessagingService() {

    override fun onNewToken(newToken: String) {
      ZendeskNativeModule.getInstance().updatePushNotificationToken(newToken)
    }

    override fun onMessageReceived(remoteMessage: RemoteMessage) {
      val isHandled = ZendeskNativeModule
        .getInstance()
        .handleNotification(context, remoteMessage.data)

      // remote message was handled by Zendesk SDK
      if (isHandled) return

      // other push notifications code here
    }
  }
  ```
- Java
  ```java
  import androidx.annotation.NonNull;
  import com.google.firebase.messaging.FirebaseMessagingService;
  import com.google.firebase.messaging.RemoteMessage;
  import dev.geundung.zendesk.messaging.ZendeskNativeModule;

  // Your FirebaseMessagingService
  public class SampleMessagingService extends FirebaseMessagingService {

    @Override
    public void onNewToken(@NonNull String newToken) {
      ZendeskNativeModule.getInstance().updatePushNotificationToken(newToken);
    }

    @Override
    public void onMessageReceived(@NonNull RemoteMessage remoteMessage) {
      Boolean isHandled = ZendeskNativeModule
        .getInstance()
        .handleNotification(context, remoteMessage.getData());

      // remote message was handled by Zendesk SDK
      if (isHandled) return;

      // other push notifications code here
    }
  }
  ```

## Integrate with @react-native-firebase/messaging

This guide for integrate with [@react-native-firebase/messaging](https://rnfirebase.io/messaging/usage).

```ts
import messaging from '@react-native-firebase/messaging';
import * as Zendesk from 'react-native-zendesk-messaging';

messaging().getToken().then((token) => {
  Zendesk.updatePushNotificationToken(token);
});

messaging().onTokenRefresh((token) => {
  Zendesk.updatePushNotificationToken(token);
});

messaging().onMessage(async (remoteMessage) => {
  const responsibility = await Zendesk.handleNotification(remoteMessage.data);

  switch (responsibility) {
    case 'MESSAGING_SHOULD_DISPLAY':
    case 'MESSAGING_SHOULD_NOT_DISPLAY':
      // remote message was handled by Zendesk SDK
      return;

    case 'NOT_FROM_MESSAGING':
    default:
      break;
  }

  // other handing code here
});
```
