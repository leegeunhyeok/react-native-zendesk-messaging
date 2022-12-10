import { NativeModules, NativeEventEmitter, Platform } from 'react-native';
import type { EmitterSubscription } from 'react-native';
import type {
  ZendeskInitializeConfig,
  ZendeskUser,
  ZendeskEventType,
  ZendeskEventResponse,
} from './types';

const LINKING_ERROR =
  `The package 'react-native-zendesk-messaging' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

const ZendeskMessaging = NativeModules.ZendeskMessaging
  ? NativeModules.ZendeskMessaging
  : new Proxy(
      {},
      {
        get() {
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

export function addEventListener<EventType extends ZendeskEventType>(
  type: EventType,
  listener: (event: ZendeskEventResponse[EventType]) => void
) {
  return eventEmitter.addListener(type, listener);
}

export function removeSubscription(subscription: EmitterSubscription) {
  return eventEmitter.removeSubscription(subscription);
}

export function removeAllListeners(type: ZendeskEventType) {
  return eventEmitter.removeAllListeners(type);
}
