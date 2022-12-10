import Foundation
import ZendeskSDK
import ZendeskSDKMessaging

@objc(ZendeskNativeModule)
class ZendeskNativeModule: NSObject {
  static let shared = ZendeskNativeModule()

  func initialize(withChannelKey channelKey: String, messagingFactory: ZendeskSDK.MessagingFactory? = nil, completionHandler: @escaping (Result<ZendeskSDK.Zendesk, Error>) -> Void) -> Void {
    Zendesk.initialize(
      withChannelKey: channelKey,
      messagingFactory: messagingFactory,
      completionHandler: completionHandler
    )
  }

  func addEventObserver(_ observer: AnyObject, _ completionHandler: @escaping (ZendeskSDK.ZendeskEvent) -> Void) -> Void {
    Zendesk.instance?.addEventObserver(observer, completionHandler)
  }

  func loginUser(_ token: String, completionHandler: ((Result<ZendeskSDK.ZendeskUser, Error>) -> Void)? = nil) -> Void {
    Zendesk.instance?.loginUser(with: token, completionHandler: completionHandler)
  }

  func logoutUser(_ completionHandler: ((Result<Void, Error>) -> Void)? = nil) -> Void {
    Zendesk.instance?.logoutUser(completionHandler: completionHandler)
  }

  func getMessagingViewController() -> UIViewController? {
    return Zendesk.instance?.messaging?.messagingViewController()
  }

  func updatePushNotificationToken(_ token: Data) -> Void {
    PushNotifications.updatePushNotificationToken(token)
  }
}
