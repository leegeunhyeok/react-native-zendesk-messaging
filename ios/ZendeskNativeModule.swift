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

  func setConversationFields(
    _ fields: [String: AnyHashable]
  ) {
    Zendesk.instance?.messaging?.setConversationFields(fields)
  }

  func clearConversationFields() {
    Zendesk.instance?.messaging?.clearConversationFields()
  }

  func setConversationTags(
    _ tags: [String]
  ) {
    Zendesk.instance?.messaging?.setConversationTags(tags)
  }

  func clearConversationTags() {
    Zendesk.instance?.messaging?.clearConversationTags()
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
  /// This method resolves race condition of push notification(handleNotification).
  ///
  /// From inactivated app, when start up application via Zendesk push notification,
  /// expect showing messaging view, but  not showing because handleNotification called before initialize
  ///
  /// Situation
  /// 1. Launch app via Zendesk push notification
  /// 2. (Race condition here)
  /// |
  /// +-+- [A-1]. didReceiveNotificationResponse called (on AppDelegate)
  ///   |  [A-2]. ZendeskNativeModule.handleNotification called
  ///   |
  ///   +- [B]. Load react-native bundle and Zendesk.initialize called on JS
  ///
  /// On [A-2] if Zendesk module isn't initialized yet,
  /// handleNotification will do nothing because zendesk is not initialized.
  /// should initialized before call handleNotification
  ///
  /// Mechanism
  ///
  /// > Using completionHandler for result flag(openBeforeInitialize)
  ///
  /// 1. call openMessageViewByPushNotification
  /// 2. check userInfo
  ///    [case 1]. If exist -> keep going
  ///    [case 2]. If not exist -> call completionHandler with `false`
  /// 3. call PushNotifications.handleTap
  ///    [case 1]. viewController provided when zendesk is initialized
  ///    - open messaging view
  ///    - call completionHandler with `false`
  ///    [case 2]. viewController is nil when zendesk is not initialized
  ///    - call completionHandler with `true`
  ///    - store userInfo temporary into receivedUserInfo
  /// 4. call ZendeskNativeModule.initialize and success
  ///    [case 1]. skipOpenMessaging is enabled
  ///    - Do nothing (push notification will ignored)
  ///    [case 2]. skipOpenMessaging is disabled (default)
  ///    - call openMessageViewByPushNotification again
  ///    - receivedUserInfo exist and call PushNotifications.handleTap
  ///    - viewController is provided -> open messaging view
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
      if let navigationController = rootController as? UINavigationController {
        navigationController.pushViewController(viewController, animated: true)
      } else {
        rootController.show(viewController, sender: self)
      }
      completionHandler?(false)
    }
  }
}
