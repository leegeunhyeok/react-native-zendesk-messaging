export interface ZendeskInitializeConfig {
  channelKey: string;
  skipOpenMessaging?: boolean;
}

export interface ZendeskPageViewEvent {
  pageTitle: string;
  url: string;
}

export interface ZendeskUser {
  id: string;
  externalId: string;
}

export type ZendeskNotificationResponsibility =
  | 'MESSAGING_SHOULD_DISPLAY'
  | 'MESSAGING_SHOULD_NOT_DISPLAY'
  | 'NOT_FROM_MESSAGING'
  | 'UNKNOWN';

export type ZendeskEventType = keyof ZendeskEventResponse;
export type ZendeskEvent<Type extends ZendeskEventType> =
  ZendeskEventResponse[Type];

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions -- allow type
type ZendeskEventResponse = {
  unreadMessageCountChanged: {
    unreadCount: number;
  };
  authenticationFailed: {
    reason: string;
  };
};
