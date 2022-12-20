import {
  NativeModules,
  NativeEventEmitter,
  Platform,
  type EmitterSubscription,
} from 'react-native';
import type {
  ZendeskInitializeConfig,
  ZendeskUser,
  ZendeskPageViewEvent,
  ZendeskNotificationResponsibility,
  ZendeskEventType,
  ZendeskEvent,
} from './types';

const LINKING_ERROR =
  `The package 'react-native-zendesk-messaging' doesn't seem to be linked. Make sure: \n\n${
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' })
  }- You rebuilt the app after installing the package\n` +
  `- You are not using Expo Go\n`;

const ZendeskMessaging = NativeModules.ZendeskMessaging
  ? NativeModules.ZendeskMessaging
  : new Proxy(
      {},
      {
        get(): never {
          throw new Error(LINKING_ERROR);
        },
      }
    );

const eventEmitter = new NativeEventEmitter(ZendeskMessaging);

export function initialize(config: ZendeskInitializeConfig): Promise<void> {
  return ZendeskMessaging.initialize(config);
}

export function login(token: string): Promise<ZendeskUser> {
  return ZendeskMessaging.login(token);
}

export function logout(): Promise<void> {
  return ZendeskMessaging.logout();
}

export function openMessagingView(): Promise<void> {
  return ZendeskMessaging.openMessagingView();
}

export function sendPageViewEvent(event: ZendeskPageViewEvent): Promise<void> {
  return ZendeskMessaging.sendPageViewEvent(event);
}

export function updatePushNotificationToken(token: string): void {
  if (Platform.OS !== 'android') return;
  return ZendeskMessaging.updatePushNotificationToken(token);
}

export function getUnreadMessageCount(): Promise<number> {
  return ZendeskMessaging.getUnreadMessageCount();
}

export function handleNotification(
  remoteMessage: Record<string, string>
): Promise<ZendeskNotificationResponsibility> {
  return Platform.OS === 'android'
    ? ZendeskMessaging.handleNotification(remoteMessage)
    : Promise.resolve('UNKNOWN');
}

export function addEventListener<EventType extends ZendeskEventType>(
  type: EventType,
  listener: (event: ZendeskEvent<EventType>) => void
): EmitterSubscription {
  return eventEmitter.addListener(type, listener);
}

export function removeSubscription(subscription: EmitterSubscription): void {
  eventEmitter.removeSubscription(subscription);
}

export function removeAllListeners(type: ZendeskEventType): void {
  eventEmitter.removeAllListeners(type);
}
