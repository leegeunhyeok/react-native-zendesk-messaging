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

export type ZendeskEventType = keyof ZendeskEventResponse;

export type ZendeskEventResponse = {
  unreadMessageCountChanged: {
    unreadCount: number;
  };
  authenticationFailed: {
    reason: string;
  };
};
