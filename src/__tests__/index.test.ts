import { NativeModules } from 'react-native';
import type { Platform as RNPlatform } from 'react-native';
import * as Zendesk from '../index';

jest.mock('react-native', () => {
  const reactNative = jest.requireActual('react-native');

  reactNative.NativeModules.ZendeskMessaging = {
    initialize: jest.fn(),
    login: jest.fn(),
    logout: jest.fn(),
    openMessagingView: jest.fn(),
    sendPageViewEvent: jest.fn(),
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
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    Platform = require('react-native').Platform;
  });

  describe('when call initialize', () => {
    const CHANNEL_KEY = '';
    let mockInitialize: jest.SpyInstance;

    beforeEach(async () => {
      mockInitialize = jest.spyOn(ZendeskMessagingModule, 'initialize');
      await Zendesk.initialize({ channelKey: CHANNEL_KEY });
    });

    it('should call native module\'s initialize method', () => {
      expect(mockInitialize).toHaveBeenCalledTimes(1);
      expect(mockInitialize).toHaveBeenCalledWith({ channelKey: CHANNEL_KEY });
    });
  });

  describe('when call login', () => {
    const TOKEN = '';
    let mockLogin: jest.SpyInstance;

    beforeEach(async () => {
      mockLogin = jest.spyOn(ZendeskMessagingModule, 'login');
      await Zendesk.login(TOKEN);
    });

    it('should call native module\'s login method', () => {
      expect(mockLogin).toHaveBeenCalledTimes(1);
      expect(mockLogin).toHaveBeenCalledWith(TOKEN);
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

  describe('when call sendPageViewEvent', () => {
    const PAGE_TITLE = '';
    const URL = '';
    let mockSendPageViewEvent: jest.SpyInstance;

    beforeEach(async () => {
      mockSendPageViewEvent = jest.spyOn(ZendeskMessagingModule, 'sendPageViewEvent');
      await Zendesk.sendPageViewEvent({ pageTitle: PAGE_TITLE, url: URL });
    });

    it('should call native module\'s sendPageViewEvent method', () => {
      expect(mockSendPageViewEvent).toHaveBeenCalledTimes(1);
      expect(mockSendPageViewEvent).toHaveBeenCalledWith({ pageTitle: PAGE_TITLE, url: URL });
    });
  });

  describe('when call updatePushNotificationToken', () => {
    const TOKEN = '';
    let mockUpdatePushNotificationToken: jest.SpyInstance;

    describe('when platform is Android', () => {
      beforeAll(() => {
        Platform.OS = 'android';
      });

      beforeEach(() => {
        mockUpdatePushNotificationToken = jest.spyOn(ZendeskMessagingModule, 'updatePushNotificationToken');
        Zendesk.updatePushNotificationToken(TOKEN);
      });

      afterAll(() => {
        mockUpdatePushNotificationToken.mockClear();
      });

      it('should call native module\'s updatePushNotificationToken method', () => {
        expect(mockUpdatePushNotificationToken).toHaveBeenCalledTimes(1);
        expect(mockUpdatePushNotificationToken).toHaveBeenCalledWith(TOKEN);
      });
    });

    describe('when platform is iOS', () => {
      beforeAll(() => {
        Platform.OS = 'ios';
      });

      beforeEach(() => {
        mockUpdatePushNotificationToken = jest.spyOn(ZendeskMessagingModule, 'updatePushNotificationToken');
        Zendesk.updatePushNotificationToken(TOKEN);
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
