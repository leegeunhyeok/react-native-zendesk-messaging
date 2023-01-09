# Push Notifications for iOS

- [Basic setup](#basic-setup)
- [Set Push Notification token](#set-push-notification-token)
- [Show and handle push notifications in your app](#show-and-handle-push-notifications-in-your-app)

## Basic setup

Follow [official guide](https://developer.zendesk.com/documentation/zendesk-web-widget-sdks/sdks/ios/push_notifications) (Step 1~5)

- Step 1 - Creating your `.p12` certificate on the Apple Developer site
- Step 2 - Adding your `.p12` certificate in the Zendesk Admin Center
- Step 3 - Add the push notifications capability to your project
- Step 4 - Set the APS Environment entitlement
- Step 5 - Request authorization for push notifications from your user

## Set Push Notification token

> Add code snippets in your application.
> If already exist in your code, skip and go to the next step.

```objectivec
// `AppDelegate.m` or `AppDelegate.mm`
#import <ZendeskNativeModule.h>

- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken {
  [ZendeskNativeModule updatePushNotificationToken:deviceToken];
}
```

## Show and handle push notifications in your app

```objectivec
// AppDelegate.h
#import <UserNotifications/UserNotifications.h>

@interface AppDelegate : UIResponder <UIApplicationDelegate, RCTBridgeDelegate, UNUserNotificationCenterDelegate>
```

```objectivec
// `AppDelegate.m` or `AppDelegate.mm`

// (1. Show push notifications)
// ZendeskNativeModule.showNotification
- (void)userNotificationCenter:(UNUserNotificationCenter *)center
        willPresentNotification:(UNNotification *)notification
        withCompletionHandler:(void (^)(UNNotificationPresentationOptions))completionHandler {

  id userInfo = notification.request.content.userInfo;
  BOOL isHandled = [ZendeskNativeModule showNotification:userInfo completionHandler:completionHandler];

  if (isHandled) return;

  // other handing code here

  // If not handled, you should call the `completionHandler` before end of `userNotificationCenter` method
  completionHandler(UNNotificationPresentationOptionNone);
}

// (2. Handle tap notifications)
// ZendeskNativeModule.handleNotification
- (void)userNotificationCenter:(UNUserNotificationCenter *)center
        didReceiveNotificationResponse:(UNNotificationResponse *)response
        withCompletionHandler:(void (^)(void))completionHandler {

  id userInfo = response.notification.request.content.userInfo;

  BOOL isHandled = [ZendeskNativeModule handleNotification:userInfo completionHandler:completionHandler];

  if (isHandled) return;

  // other handing code here

  // If not handled, you should call the `completionHandler` before end of `userNotificationCenter` method
  completionHandler();
}
```
