import Foundation
import React
import ZendeskSDK
import ZendeskSDKMessaging

@objc(ZendeskNativeModule)
class ZendeskNativeModule: NSObject {
  private static var receivedUserInfo: [AnyHashable: Any]?
  static let shared = ZendeskNativeModule()

  func initialize(
    withChannelKey channelKey: String,
    messagingFactory: ZendeskSDK.MessagingFactory? = nil,
    completionHandler: @escaping (Result<ZendeskSDK.Zendesk, Error>) -> Void
  ) -> Void {
    Zendesk.initialize(
      withChannelKey: channelKey,
      messagingFactory: messagingFactory,
      completionHandler: completionHandler
    )
  }

  func reset() -> Void {
    Zendesk.invalidate()
  }

  func addEventObserver(
    _ observer: AnyObject,
    _ completionHandler: @escaping (ZendeskSDK.ZendeskEvent) -> Void
  ) -> Void {
    Zendesk.instance?.addEventObserver(observer, completionHandler)
  }

  func loginUser(
    _ token: String,
    completionHandler: ((Result<ZendeskSDK.ZendeskUser, Error>) -> Void)? = nil
  ) -> Void {
    Zendesk.instance?.loginUser(with: token, completionHandler: completionHandler)
  }

  func logoutUser(
    _ completionHandler: ((Result<Void, Error>) -> Void)? = nil
  ) -> Void {
    Zendesk.instance?.logoutUser(completionHandler: completionHandler)
  }

  func getMessagingViewController() -> UIViewController? {
    return Zendesk.instance?.messaging?.messagingViewController()
  }

  func sendPageViewEvent(
    pageTitle: String,
    url: String,
    completionHandler: @escaping (Result<Void, Error>) -> Void
  ) {
    let pageView = PageView(pageTitle: pageTitle, url: url)
    Zendesk.instance?.sendPageViewEvent(pageView, completionHandler: completionHandler)
  }

  func getUnreadMessageCount() -> Int? {
    return Zendesk.instance?.messaging?.getUnreadMessageCount()
  }

  @objc(updatePushNotificationToken:)
  static func updatePushNotificationToken(_ token: Data) -> Void {
    PushNotifications.updatePushNotificationToken(token)
  }

  @objc(showNotification:completionHandler:)
  static func showNotification(
    _ userInfo: [AnyHashable: Any],
    withCompletionHandler completionHandler: @escaping (UNNotificationPresentationOptions) -> Void
  ) -> Bool {
    var handled = true
    let shouldBeDisplayed = PushNotifications.shouldBeDisplayed(userInfo)

    switch shouldBeDisplayed {
    case .messagingShouldDisplay:
      if #available(iOS 14.0, *) {
        completionHandler([.banner, .sound, .badge])
      } else {
        completionHandler([.alert, .sound, .badge])
      }
    case .messagingShouldNotDisplay:
      completionHandler([])
    case .notFromMessaging:
      fallthrough
    @unknown default:
      handled = false
    }

    return handled
  }

  @objc(handleNotification:completionHandler:)
  static func handleNotification(
    _ userInfo: [AnyHashable: Any],
    withCompletionHandler completionHandler: @escaping () -> Void
  ) -> Bool {
    var handled = true
    let shouldBeDisplayed = PushNotifications.shouldBeDisplayed(userInfo)

    switch shouldBeDisplayed {
    case .messagingShouldDisplay:
      openMessageViewByPushNotification(userInfo) { openBeforeInitialize in
        receivedUserInfo = openBeforeInitialize ? userInfo : nil
      }
      completionHandler()
    case .messagingShouldNotDisplay:
      completionHandler()
    case .notFromMessaging:
      fallthrough
    @unknown default:
      handled = false
    }

    return handled
  }

  /// NOTE:
  /// This method dependent on handleNotification.
  ///
  /// Store userInfo(from notification payload) temporary and re-call handleTap for showing messaging view
  /// because PushNotifications.handleTap always return nil when messaging is not initialized
  ///
  /// eg. inactivated app, start up application via Zendesk push notification
  /// expect showing messaging view, but handleNotification will be called before initialize
  /// = (do nothing, not showing messaging view)
  static func openMessageViewByPushNotification(
    _ userInfo: [AnyHashable: Any]? = nil,
    completionHandler: ((Bool) -> Void)? = nil
  ) -> Void {
    guard let userInfo = userInfo ?? receivedUserInfo else {
      completionHandler?(false)
      return
    }

    PushNotifications.handleTap(userInfo) { viewController in
      receivedUserInfo = nil
      guard let rootController = RCTPresentedViewController(),
            let viewController = viewController else {
        completionHandler?(viewController == nil)
        return
      }
      rootController.show(viewController, sender: self)
      completionHandler?(false)
    }
  }
}
