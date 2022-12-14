export interface ZendeskInitializeConfig {
  channelKey: string;
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

type ZendeskEventResponse = {
  unreadMessageCountChanged: {
    unreadCount: number;
  };
  authenticationFailed: {
    reason: string;
  };
};
