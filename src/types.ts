export interface ZendeskInitializeConfig {
  channelKey: string;
}

export interface ZendeskPageViewEvent {
  pageTitle: string;
  url: string;
}

export type ZendeskUser = {
  id: string;
  externalId: string;
};

export type ZendeskNotificationResponsibility =
  | 'MESSAGING_SHOULD_DISPLAY'
  | 'MESSAGING_SHOULD_NOT_DISPLAY'
  | 'NOT_FROM_MESSAGING'
  | 'UNKNOWN';

export type ZendeskEventType = keyof ZendeskEventResponse;

export type ZendeskEventResponse = {
  unreadMessageCountChanged: {
    unreadCount: number;
  };
  authenticationFailed: {
    reason: string;
  };
};
