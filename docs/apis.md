# API References

## Index

- [initialize](#initialize)
- [reset](#reset)
- [login](#login)
- [logout](#logout)
- [openMessagingView](#openmessagingview)
- [closeMessagingView](#closeMessagingView)
- [sendPageViewEvent](#sendpageviewevent)
- [setConversationFields](#setconversationfields)
- [clearConversationFields](#clearconversationfields)
- [setConversationTags](#setconversationtags)
- [clearConversationTags](#clearconversationtags)
- [updatePushNotificationToken](#updatepushnotificationtoken)
- [getUnreadMessageCount](#getunreadmessagecount)
- [handleNotification](#handlenotification)
- [addEventListener](#addeventlistener)
- [removeSubscription](#removesubscription)
- [removeAllListeners](#removealllisteners)

## initialize

Initializing Zendesk SDK.

You should call this function first before using other features.

- Parameters
  | Name | Type | Required |
  |:--|:--|:--|
  | config | `ZendeskInitializeConfig` | Yes |
- Return Value
  | Type |
  |:--|
  | `Promise<void>` |

```ts
/* interfaces */

interface ZendeskInitializeConfig {
  channelKey: string;
  skipOpenMessaging?: boolean; // iOS Only
}

function initialize(config: ZendeskInitializeConfig): Promise<void>
```


```ts
initialize({ channelKey: 'YOUR_ZENDESK_CHANNEL_KEY' });
```

- `channelKey`: Zendesk channel key
- `skipOpenMessaging`: skip open messaging view after initialize successfully (default: `false`, iOS only)
  - application started by Zendesk push notification, showing messaging view for users.

---

- References
  - [Android SDK](https://developer.zendesk.com/documentation/zendesk-web-widget-sdks/sdks/android/getting_started/#initialize-the-sdk)
  - [iOS SDK](https://developer.zendesk.com/documentation/zendesk-web-widget-sdks/sdks/ios/getting_started/#initialize-the-sdk)

## reset

Invalidates the current instance of Zendesk.
After calling this method you will have to call [initialize](#initialize) again if you would like to use Zendesk.

- Return Value
  | Type |
  |:--|
  | `void` |

```ts
/* interfaces */

function reset(): void
```


```ts
reset();
```

- References
  - [Android SDK](https://zendesk.github.io/mobile_sdk_javadocs/zendesk/zendesk-android/latest/zendesk/android/Zendesk.Companion.html#invalidate())
  - [iOS SDK](https://zendesk.github.io/sdk_zendesk_ios/Zendesk/#zendesk.invalidate())

## login

To authenticate a user call the `login` with your own JWT.

- Parameters
  | Name | Type | Required |
  |:--|:--|:--|
  | token | `string` | Yes |
- Return Value
  | Type |
  |:--|
  | `Promise<ZendeskUser>` |

```ts
/* interfaces */

interface ZendeskUser {
  id: string;
  externalId: string;
}

function login(token: string): Promise<ZendeskUser>
```


```ts
const user = await login('eyJhb...Your own JWT...ssw5c');
```

- References
  - [Android SDK](https://developer.zendesk.com/documentation/zendesk-web-widget-sdks/sdks/android/advanced_integration/#loginuser)
  - [iOS SDK](https://developer.zendesk.com/documentation/zendesk-web-widget-sdks/sdks/ios/advanced_integration/#loginuser)

## logout

To unauthenticate a user call the `logout`.

- Return Value
  | Type |
  |:--|
  | `Promise<void>` |

```ts
/* interfaces */

function logout(): Promise<void>
```


```ts
logout();
```

- References
  - [Android SDK](https://developer.zendesk.com/documentation/zendesk-web-widget-sdks/sdks/android/advanced_integration/#logoutuser)
  - [iOS SDK](https://developer.zendesk.com/documentation/zendesk-web-widget-sdks/sdks/ios/advanced_integration/#logoutuser)

## openMessagingView

Show the native based conversation screen.

- Return Value
  | Type |
  |:--|
  | `Promise<void>` |

```ts
/* interfaces */

function openMessagingView(): Promise<void>
```


```ts
openMessagingView();
```

- References
  - [Android SDK](https://developer.zendesk.com/documentation/zendesk-web-widget-sdks/sdks/android/getting_started/#show-the-conversation)
  - [iOS SDK](https://developer.zendesk.com/documentation/zendesk-web-widget-sdks/sdks/ios/getting_started/#show-the-conversation)

## closeMessagingView

> [!IMPORTANT]
>
> iOS only (no-op for other platform, always return empty promise)

Close the messaging view if it is open.

- Return Value
  | Type |
  |:--|
  | `Promise<void>` |

```ts
/* interfaces */

function closeMessagingView(): Promise<void>
```


```ts
closeMessagingView();
```

## sendPageViewEvent

Send session-based page view event. event must have `pageTitle` and `url`.

Sent events can be seen in agent workspace by support agents using Zendesk.

- Parameters
  | Name | Type | Required |
  |:--|:--|:--|
  | event | `ZendeskPageViewEvent` | Yes |
- Return Value
  | Type |
  |:--|
  | `Promise<void>` |

```ts
/* interfaces */

interface ZendeskPageViewEvent {
  pageTitle: string;
  url: string;
}

function sendPageViewEvent(event: ZendeskPageViewEvent): Promise<void>
```

```ts
sendPageViewEvent({
  pageTitle: 'Home',
  url: 'RootStack/HomeScreen', // eg. react-navigation's current path string
});
```

- References
  - [Android SDK](https://developer.zendesk.com/documentation/zendesk-web-widget-sdks/sdks/android/advanced_integration/#page-view-event)
  - [iOS SDK](https://developer.zendesk.com/documentation/zendesk-web-widget-sdks/sdks/ios/advanced_integration/#page-view-event)

## setConversationFields

Allows values for conversation fields to be set in the SDK to add contextual data about the conversation.

> [!NOTE]
>
> Conversation fields are not immediately associated with a conversation when the API is called. Calling the API will store the conversation fields, but those fields will only be applied to a conversation when end users either start a new conversation or send a new message in an existing conversation.

> [!NOTE]
>
> An event for handling failed validation checks on conversation fields set using the setConversationFields API will be added in an upcoming release of the Zendesk SDK.

- Parameters
  | Name | Type | Required |
  |:--|:--|:--|
  | fields | `Record<string, string | number | boolean>` | Yes |
- Return Value
  | Type |
  |:--|
  | `void` |


```ts
/* interfaces */

function setConversationFields(fields: Record<string, string | number | boolean>): void
```

```ts
setConversationFields({ '4422761977114': 'FA2590' });
```

- References
  - [Android SDK](https://developer.zendesk.com/documentation/zendesk-web-widget-sdks/sdks/android/advanced_integration/#set-conversation-fields)
  - [iOS SDK](https://developer.zendesk.com/documentation/zendesk-web-widget-sdks/sdks/ios/advanced_integration/#set-conversation-fields)

## clearConversationFields

You can clear conversation fields from the SDK storage when the client side context changes. To do this, use the `clearConversationFields` API. This removes all stored conversation fields from the SDK storage.

> [!NOTE]
>
> This API does not affect conversation fields already applied to the conversation.

- Return Value
  | Type |
  |:--|
  | `void` |

```ts
/* interfaces */

function clearConversationFields(): void
```

```ts
clearConversationFields();
```

- References
  - [Android SDK](https://developer.zendesk.com/documentation/zendesk-web-widget-sdks/sdks/android/advanced_integration/#clear-conversation-fields)
  - [iOS SDK](https://developer.zendesk.com/documentation/zendesk-web-widget-sdks/sdks/ios/advanced_integration/#clear-conversation-fields)

## setConversationTags

Allows custom conversation tags to be set in the SDK to add contextual data about the conversation.

To use conversation tags, refer to [Using Messaging Metadata with the Zendesk Web Widgets and SDKs](https://support.zendesk.com/hc/en-us/articles/5658339908378).

> [!NOTE]
>
> Conversation tags are not immediately associated with a conversation when the API is called. It will only be applied to a conversation when end users either start a new conversation or send a new message in an existing conversation.

- Parameters
  | Name | Type | Required |
  |:--|:--|:--|
  | tags | `string[]` | Yes |
- Return Value
  | Type |
  |:--|
  | `void` |


```ts
/* interfaces */

function setConversationTags(tags: string[]): void
```

```ts
setConversationTags(['promo_code', 'discount']);
```

- References
  - [Android SDK](https://developer.zendesk.com/documentation/zendesk-web-widget-sdks/sdks/android/advanced_integration/#set-conversation-tags)
  - [iOS SDK](https://developer.zendesk.com/documentation/zendesk-web-widget-sdks/sdks/ios/advanced_integration/#set-conversation-tags)

## clearConversationTags

Allows you to clear conversation tags from SDK storage when the client side context changes. To do this, use the `clearConversationTags` API. This removes all stored conversation tags from the SDK storage.

> [!NOTE]
>
> This API does not affect conversation tags already applied to the conversation.

- Return Value
  | Type |
  |:--|
  | `void` |

```ts
/* interfaces */

function clearConversationTags(): void
```

```ts
clearConversationTags();
```

- References
  - [Android SDK](https://developer.zendesk.com/documentation/zendesk-web-widget-sdks/sdks/android/advanced_integration/#set-conversation-tags)
  - [iOS SDK](https://developer.zendesk.com/documentation/zendesk-web-widget-sdks/sdks/ios/advanced_integration/#set-conversation-tags)

## updatePushNotificationToken

> [!IMPORTANT]
>
> Android only (no-op for other platform, always return empty promise)

To enable a device to receive push notifications, you must notify the SDK when a new FCM token has been created.

- Parameters
  | Name | Type | Required |
  |:--|:--|:--|
  | token | `string` | Yes |
- Return Value
  | Type |
  |:--|
  | `void` |

```ts
/* interfaces */

function updatePushNotificationToken(token: string): void
```

```ts
updatePushNotificationToken('...FCM Token...');
```

- References
  - [Android SDK](https://developer.zendesk.com/documentation/zendesk-web-widget-sdks/sdks/android/push_notifications/#updating-push-notification-tokens)

## getUnreadMessageCount

Get current total number of unread messages.

- Return Value
  | Type |
  |:--|
  | `Promise<number>` |

```ts
/* interfaces */

function getUnreadMessageCount(): Promise<number>
```


```ts
const unreadCount = await getUnreadMessageCount();
```

- References
  - [Android SDK](https://developer.zendesk.com/documentation/zendesk-web-widget-sdks/sdks/android/getting_started/#unread-messages)
  - [iOS SDK](https://developer.zendesk.com/documentation/zendesk-web-widget-sdks/sdks/ios/getting_started/#unread-messages)

## handleNotification

Handle remote message that received from FCM(Firebase Cloud Messaging) and show notifications.

If remote message isn't Zendesk message, it does nothing.

> [!IMPORTANT]
>
> Android only (always returns `UNKNOWN` for others)
>
> This method for integrate with [@react-native-firebase/messaging](https://rnfirebase.io/reference/messaging).
>
> For more details, read the [Push Notifications guide](./android-push-notifications.md).

- Parameters
  | Name | Type | Required |
  |:--|:--|:--|
  | remoteMessage | `object` | Yes |
- Return Value
  | Type |
  |:--|
  | `Promise<ZendeskNotificationResponsibility>` |
    - `MESSAGING_SHOULD_DISPLAY`: remoteMessage is handled by Zendesk SDK. it will be appeared as notification
    - `MESSAGING_SHOULD_NOT_DISPLAY`: remoteMessage is handled by Zendesk SDK. but, it's not appear as notification (eg. bot response)
    - `NOT_FROM_MESSAGING`: remoteMessage is not handled by Zendesk SDK
    - `UNKNOWN`: If platform is iOS always return this value and otherwise used by fallback value.

```ts
/* interfaces */
type ZendeskNotificationResponsibility =
  | 'MESSAGING_SHOULD_DISPLAY'
  | 'MESSAGING_SHOULD_NOT_DISPLAY'
  | 'NOT_FROM_MESSAGING'
  | 'UNKNOWN';

function handleNotification(remoteMessage: Record<string, string>): Promise<ZendeskNotificationResponsibility>
```

```ts
const responsibility = await handleNotification({ ... });
```

- References
  - [Android SDK](https://developer.zendesk.com/documentation/zendesk-web-widget-sdks/sdks/android/push_notifications/#using-a-custom-implementation-of-firebasemessagingservice)

## addEventListener

Add a listener for listening emitted events by Zendesk SDK.

- Parameters
  | Name | Type | Required |
  |:--|:--|:--|
  | type | `ZendeskEventType` | Yes |
  | listener | `(event) => void` | Yes |
- Return Value
  | Type |
  |:--|
  | EmitterSubscription |

```ts
/* interfaces */

type ZendeskEventType = 'unreadMessageCountChanged' | 'authenticationFailed';

function addEventListener<EventType extends ZendeskEventType>(type: EventType, listener: (event: ZendeskEventResponse[EventType]) => void): EmitterSubscription
```

```ts
const unreadMessageCountChangedSubscription = addEventListener('unreadMessageCountChanged', (event) => {
  // Event type
  // { unreadCount: number; }
});

const authenticationFailedSubscription = addEventListener('authenticationFailed', (event) => {
  // Event type
  // { reason: string; }
});
```

- References
  - [Android SDK](https://developer.zendesk.com/documentation/zendesk-web-widget-sdks/sdks/android/advanced_integration/#eventlistener)
  - [iOS SDK](https://developer.zendesk.com/documentation/zendesk-web-widget-sdks/sdks/ios/advanced_integration/#eventobserver)

## removeSubscription

Remove subscribed event listener

- Parameters
  | Name | Type | Required |
  |:--|:--|:--|
  | subscription | `EmitterSubscription` | Yes |
- Return Value
  - `void`

```ts
/* interfaces */

function removeSubscription(subscription: EmitterSubscription): void
```

```ts
removeSubscription(subscription);
```

## removeAllListeners

Remove all of registered listener by event type.

- Parameters
  | Name | Type | Required |
  |:--|:--|:--|
  | type | `ZendeskEventType` | Yes |
- Return Value
  - `void`

```ts
/* interfaces */

function removeAllListeners(type: ZendeskEventType): void
```

```ts
removeAllListeners('unreadMessageCountChanged');
```
