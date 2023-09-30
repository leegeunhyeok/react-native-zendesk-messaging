import {
  NativeModules,
  NativeEventEmitter,
  Platform,
} from 'react-native';
import type { EmitterSubscription } from 'react-native';
import { ZendeskMessagingError } from './error';
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
  if (typeof config.channelKey !== 'string') {
    return Promise.reject(new ZendeskMessagingError('invalid channelKey'));
  }
  return ZendeskMessaging.initialize({ skipOpenMessaging: false, ...config });
}

export function reset(): void {
  return ZendeskMessaging.reset();
}

export function login(token: string): Promise<ZendeskUser> {
  if (typeof token !== 'string' || !token.length) {
    return Promise.reject(new ZendeskMessagingError('invalid token'));
  }
  return ZendeskMessaging.login(token);
}

export function logout(): Promise<void> {
  return ZendeskMessaging.logout();
}

export function openMessagingView(): Promise<void> {
  return ZendeskMessaging.openMessagingView();
}

export function sendPageViewEvent(event: ZendeskPageViewEvent): Promise<void> {
  if (typeof event.pageTitle !== 'string' || typeof event.url !== 'string') {
    return Promise.reject(new ZendeskMessagingError('invalid event data'));
  }
  return ZendeskMessaging.sendPageViewEvent(event);
}

/**
 * Required SDK version: `>= 2.13.0`
 */
export function setConversationFields(fields: Record<string, string | number | boolean>): void {
  if (Object.values(fields).some((value) =>
    !(
      typeof value === 'string' ||
      typeof value === 'number' ||
      typeof value === 'boolean')
    )
  ) {
    throw new ZendeskMessagingError('invalid fields');
  }
  ZendeskMessaging.setConversationFields(fields);
}

/**
 * Required SDK version: `>= 2.13.0`
 */
export function clearConversationFields(): void {
  ZendeskMessaging.clearConversationFields();
}

/**
 * Required SDK version: `>= 2.13.0`
 */
export function setConversationTags(tags: string[]): void {
  if (tags.some((value) => typeof value !== 'string')) {
    throw new ZendeskMessagingError('invalid tags');
  }
  ZendeskMessaging.setConversationTags(tags);
}

/**
 * Required SDK version: `>= 2.13.0`
 */
export function clearConversationTags(): void {
  ZendeskMessaging.clearConversationTags();
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
