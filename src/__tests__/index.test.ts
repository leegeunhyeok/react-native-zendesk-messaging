/* eslint-disable @typescript-eslint/no-shadow -- test */
import { NativeModules, type Platform as RNPlatform } from 'react-native';
import { faker } from '@faker-js/faker';
import * as Zendesk from '../index';
import { ZendeskMessagingError } from '../error';
import type { ZendeskInitializeConfig, ZendeskPageViewEvent } from '../types';

jest.mock('react-native', () => {
  const reactNative = jest.requireActual('react-native');

  reactNative.NativeModules.ZendeskMessaging = {
    initialize: jest.fn(),
    reset: jest.fn(),
    login: jest.fn(),
    logout: jest.fn(),
    openMessagingView: jest.fn(),
    closeMessagingView: jest.fn(),
    sendPageViewEvent: jest.fn(),
    setConversationFields: jest.fn(),
    clearConversationFields: jest.fn(),
    setConversationTags: jest.fn(),
    clearConversationTags: jest.fn(),
    updatePushNotificationToken: jest.fn(),
    getUnreadMessageCount: jest.fn(),
    handleNotification: jest.fn(),
    addEventListener: jest.fn(),
    removeSubscription: jest.fn(),
    removeAllListeners: jest.fn(),
  };

  return reactNative;
});

const ZendeskMessagingModule = NativeModules.ZendeskMessaging;

describe('react-native-zendesk-messaging', () => {
  let Platform: typeof RNPlatform;

  beforeEach(() => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires -- test
    Platform = require('react-native').Platform;
  });

  describe('when call initialize', () => {
    describe('when valid configuration present', () => {
      const DEFAULT_OPTIONS = { skipOpenMessaging: false } as const;
      let channelKey: string;
      let mockInitialize: jest.SpyInstance;

      beforeEach(async () => {
        channelKey = faker.datatype.uuid();
        mockInitialize = jest.spyOn(ZendeskMessagingModule, 'initialize');
        await Zendesk.initialize({ ...DEFAULT_OPTIONS, channelKey });
      });

      it('should call native module\'s initialize method', () => {
        expect(mockInitialize).toHaveBeenCalledTimes(1);
        expect(mockInitialize).toHaveBeenCalledWith({ ...DEFAULT_OPTIONS, channelKey });
      });
    });

    describe('when invalid configuration present', () => {
      const CONFIG = {} as ZendeskInitializeConfig;

      it('should throw error', async () => {
        await expect(Zendesk.initialize(CONFIG)).rejects.toThrow(ZendeskMessagingError);
      });
    });
  });

  describe('when call reset', () => {
    let mockReset: jest.SpyInstance;

    beforeEach(() => {
      mockReset = jest.spyOn(ZendeskMessagingModule, 'reset');
      Zendesk.reset();
    });

    it('should call native module\'s reset method', () => {
      expect(mockReset).toHaveBeenCalledTimes(1);
    });
  });

  describe('when call login', () => {
    let token: string;
    let mockLogin: jest.SpyInstance;

    beforeEach(async () => {
      token = faker.random.alphaNumeric();
      mockLogin = jest.spyOn(ZendeskMessagingModule, 'login');
      await Zendesk.login(token);
    });

    it('should call native module\'s login method', () => {
      expect(mockLogin).toHaveBeenCalledTimes(1);
      expect(mockLogin).toHaveBeenCalledWith(token);
    });
  });

  describe('when call logout', () => {
    let mockLogout: jest.SpyInstance;

    beforeEach(async () => {
      mockLogout = jest.spyOn(ZendeskMessagingModule, 'logout');
      await Zendesk.logout();
    });

    it('should call native module\'s logout method', () => {
      expect(mockLogout).toHaveBeenCalledTimes(1);
    });
  });

  describe('when call openMessagingView', () => {
    let mockOpenMessagingView: jest.SpyInstance;

    beforeEach(async () => {
      mockOpenMessagingView = jest.spyOn(ZendeskMessagingModule, 'openMessagingView');
      await Zendesk.openMessagingView();
    });

    it('should call native module\'s openMessagingView method', () => {
      expect(mockOpenMessagingView).toHaveBeenCalledTimes(1);
    });
  });

  describe('when call closeMessagingView', () => {
    let mockCloseMessagingView: jest.SpyInstance;

    describe('when platform is iOS', () => {
      beforeAll(() => {
        Platform.OS = 'ios';
      });

      beforeEach(async () => {
        mockCloseMessagingView = jest.spyOn(ZendeskMessagingModule, 'closeMessagingView');
        await Zendesk.closeMessagingView();
      });

      afterAll(() => {
        mockCloseMessagingView.mockClear();
      });

      it('should call native module\'s openMessagingView method', () => {
        expect(mockCloseMessagingView).toHaveBeenCalledTimes(1);
      });
    });

    describe('when platform is Android', () => {
      beforeAll(() => {
        Platform.OS = 'android';
      });

      beforeEach(async () => {
        mockCloseMessagingView = jest.spyOn(ZendeskMessagingModule, 'closeMessagingView');
        await Zendesk.closeMessagingView();
      });

      afterAll(() => {
        mockCloseMessagingView.mockClear();
      });

      it('should call native module\'s openMessagingView method', () => {
        expect(mockCloseMessagingView).not.toHaveBeenCalled();
      });
    });
  });

  describe('when call sendPageViewEvent', () => {
    let pageTitle: string;
    let url: string;

    describe('when valid event data present', () => {
      let mockSendPageViewEvent: jest.SpyInstance;

      beforeEach(async () => {
        pageTitle = faker.word.noun();
        url = faker.internet.url();
        mockSendPageViewEvent = jest.spyOn(ZendeskMessagingModule, 'sendPageViewEvent');
        await Zendesk.sendPageViewEvent({ pageTitle, url });
      });

      it('should call native module\'s sendPageViewEvent method', () => {
        expect(mockSendPageViewEvent).toHaveBeenCalledTimes(1);
        expect(mockSendPageViewEvent).toHaveBeenCalledWith({ pageTitle, url });
      });
    });

    describe('when invalid event data present', () => {
      let event: ZendeskPageViewEvent;

      beforeEach(() => {
        event = faker.helpers.arrayElement([
          // invalid formats
          {} as ZendeskPageViewEvent,
          { pageTitle } as ZendeskPageViewEvent,
          { url } as ZendeskPageViewEvent,
        ]);
      });

      it('should throw error', async () => {
        await expect(Zendesk.sendPageViewEvent(event)).rejects.toThrow(ZendeskMessagingError);
      });
    });
  });

  describe('when call setConversationFields', () => {
    let fieldId: string;
    let fieldData: string;

    describe('when valid field data is present', () => {
      let mockSetConversationFields: jest.SpyInstance;

      beforeEach(() => {
        fieldId = faker.random.numeric(10);
        fieldData = faker.internet.url();
        mockSetConversationFields = jest.spyOn(ZendeskMessagingModule, 'setConversationFields');
        Zendesk.setConversationFields({ [fieldId]: fieldData });
      });

      it('should call native module\'s setConversationFields method', () => {
        expect(mockSetConversationFields).toHaveBeenCalledTimes(1);
        expect(mockSetConversationFields).toHaveBeenCalledWith({ [fieldId]: fieldData });
      });
    });

    describe('when invalid field data is present', () => {
      let fieldId: string;

      beforeEach(() => {
        fieldId = faker.random.numeric(10);
      });

      it('should throw error', () => {
        // @ts-expect-error for invalid data test
        expect(() => { Zendesk.setConversationFields({ [fieldId]: {} }); })
          .toThrow(ZendeskMessagingError);
      });
    });
  });

  describe('when call clearConversationFields', () => {
    let mockClearConversationFields: jest.SpyInstance;

    beforeEach(() => {
      mockClearConversationFields = jest.spyOn(ZendeskMessagingModule, 'clearConversationFields');
      Zendesk.clearConversationFields();
    });

    it('should call native module\'s clearConversationFields method', () => {
      expect(mockClearConversationFields).toHaveBeenCalledTimes(1);
    });
  });

  describe('when call setConversationTags', () => {
    let tags: string[];

    describe('when valid tag data is present', () => {
      let mockSetConversationTags: jest.SpyInstance;

      beforeEach(() => {
        tags = faker.lorem.words(3).split(' ');
        mockSetConversationTags = jest.spyOn(ZendeskMessagingModule, 'setConversationTags');
        Zendesk.setConversationTags(tags);
      });

      it('should call native module\'s setConversationTags method', () => {
        expect(mockSetConversationTags).toHaveBeenCalledTimes(1);
        expect(mockSetConversationTags).toHaveBeenCalledWith(tags);
      });
    });

    describe('when invalid tag data is present', () => {
      it('should throw error', () => {
        // @ts-expect-error for invalid data test
        expect(() => { Zendesk.setConversationTags([null]); })
          .toThrow(ZendeskMessagingError);
      });
    });
  });

  describe('when call clearConversationTags', () => {
    let mockClearConversationTags: jest.SpyInstance;

    beforeEach(() => {
      mockClearConversationTags = jest.spyOn(ZendeskMessagingModule, 'clearConversationTags');
      Zendesk.clearConversationTags();
    });

    it('should call native module\'s clearConversationTags method', () => {
      expect(mockClearConversationTags).toHaveBeenCalledTimes(1);
    });
  });

  describe('when call updatePushNotificationToken', () => {
    let token: string;
    let mockUpdatePushNotificationToken: jest.SpyInstance;

    describe('when platform is Android', () => {
      beforeAll(() => {
        Platform.OS = 'android';
      });

      beforeEach(() => {
        token = faker.random.alphaNumeric();
        mockUpdatePushNotificationToken = jest.spyOn(ZendeskMessagingModule, 'updatePushNotificationToken');
        Zendesk.updatePushNotificationToken(token);
      });

      afterAll(() => {
        mockUpdatePushNotificationToken.mockClear();
      });

      it('should call native module\'s updatePushNotificationToken method', () => {
        expect(mockUpdatePushNotificationToken).toHaveBeenCalledTimes(1);
        expect(mockUpdatePushNotificationToken).toHaveBeenCalledWith(token);
      });
    });

    describe('when platform is iOS', () => {
      beforeAll(() => {
        Platform.OS = 'ios';
      });

      beforeEach(() => {
        mockUpdatePushNotificationToken = jest.spyOn(ZendeskMessagingModule, 'updatePushNotificationToken');
        Zendesk.updatePushNotificationToken(token);
      });

      afterAll(() => {
        mockUpdatePushNotificationToken.mockClear();
      });

      it('should return without call native module\'s updatePushNotificationToken method', () => {
        expect(mockUpdatePushNotificationToken).not.toHaveBeenCalled();
      });
    });
  });

  describe('when call getUnreadMessageCount', () => {
    let mockGetUnreadMessageCount: jest.SpyInstance;

    beforeEach(async () => {
      mockGetUnreadMessageCount = jest.spyOn(ZendeskMessagingModule, 'getUnreadMessageCount');
      await Zendesk.getUnreadMessageCount();
    });

    it('should call native module\'s openMessagingView method', () => {
      expect(mockGetUnreadMessageCount).toHaveBeenCalledTimes(1);
    });
  });

  describe('when call handleNotification', () => {
    const REMOTE_MESSAGE = {};
    let mockHandleNotification: jest.SpyInstance;

    describe('when platform is Android', () => {
      beforeAll(() => {
        Platform.OS = 'android';
      });

      beforeEach(async () => {
        mockHandleNotification = jest.spyOn(ZendeskMessagingModule, 'handleNotification');
        await Zendesk.handleNotification(REMOTE_MESSAGE);
      });

      afterAll(() => {
        mockHandleNotification.mockClear();
      });

      it('should call native module\'s openMessagingView method', () => {
        expect(mockHandleNotification).toHaveBeenCalledTimes(1);
        expect(mockHandleNotification).toHaveBeenCalledWith(REMOTE_MESSAGE);
      });
    });

    describe('when platform is iOS', () => {
      let result: string;

      beforeAll(() => {
        Platform.OS = 'ios';
      });

      beforeEach(async () => {
        mockHandleNotification = jest.spyOn(ZendeskMessagingModule, 'handleNotification');
        result = await Zendesk.handleNotification(REMOTE_MESSAGE);
      });

      afterAll(() => {
        mockHandleNotification.mockClear();
      });

      it('should return without call native module\'s openMessagingView method', () => {
        expect(mockHandleNotification).not.toHaveBeenCalled();
      });

      it('should resolve with `UNKNOWN` value', () => {
        expect(result).toEqual('UNKNOWN');
      });
    });
  });
});
