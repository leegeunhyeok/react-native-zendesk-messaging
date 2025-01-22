import Foundation
import React
import ZendeskSDK
import ZendeskSDKMessaging

@objc(ZendeskMessaging)
class ZendeskMessaging: RCTEventEmitter {
  private var initialized = false
  private var hasListener = false

  override private init() {
    super.init()
  }

  override func startObserving() {
    hasListener = true
  }

  override func stopObserving() {
    hasListener = false
  }

  private func setupEventObserver(withInstance: Zendesk) -> Void {
    ZendeskNativeModule.shared.addEventObserver(self) { event in
      if !self.hasListener {
        return
      }

      switch event {
      case .unreadMessageCountChanged(let unreadCount):
        self.sendEvent(withName: "unreadMessageCountChanged", body: ["unreadCount": unreadCount])
      case .authenticationFailed(let error):
        self.sendEvent(withName: "authenticationFailed", body: ["reason": error.localizedDescription])
      @unknown default:
        break
      }
    }
  }

  @objc(supportedEvents)
  override func supportedEvents() -> [String] {
    return ["unreadMessageCountChanged", "authenticationFailed"]
  }

  @objc(initialize:resolver:rejecter:)
  func initialize(
    config: [String: Any],
    resolver resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock
  ) -> Void {
    if initialized {
      resolve(nil)
      return
    }

    // swiftlint:disable force_cast
    let channelKey = config["channelKey"] as! String
    let skipOpenMessaging = config["skipOpenMessaging"] as! Bool
    // swiftlint:enable force_cast

    ZendeskNativeModule.shared.initialize(
      withChannelKey: channelKey,
      messagingFactory: DefaultMessagingFactory()
    ) { result in
      switch result {
      case .success(let zendesk):
        self.setupEventObserver(withInstance: zendesk)
        self.initialized = true
        if !skipOpenMessaging {
          ZendeskNativeModule.openMessageViewByPushNotification()
        }
        resolve(nil)
      case .failure(let error):
        reject(nil, "initialize failed", error)
      }
    }
  }

  /// NOTE:
  /// `invalidate` identifier is already defined in RCTEventEmitter.
  /// so, using another name for this method.
  @objc(reset)
  func reset() {
    ZendeskNativeModule.shared.reset()
    initialized = false
  }

  @objc(login:resolver:rejecter:)
  func login(
    token: String,
    resolver resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock
  ) -> Void {
    if !initialized {
      reject(nil, "Zendesk instance not initialized", nil)
      return
    }

    ZendeskNativeModule.shared.loginUser(token) { result in
      switch result {
      case .success(let user):
        resolve(["id": user.id, "externalId": user.externalId])
      case .failure(let error):
        reject(nil, error.localizedDescription, error)
      }
    }
  }

  @objc(logout:rejecter:)
  func logout(
    resolver resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock
  ) -> Void {
    if !initialized {
      reject(nil, "Zendesk instance not initialized", nil)
      return
    }

    ZendeskNativeModule.shared.logoutUser { result in
      switch result {
      case .success:
        resolve(nil)
      case .failure(let error):
        reject(nil, error.localizedDescription, error)
      }
    }
  }

  @objc(openMessagingView:rejecter:)
  func openMessagingView(
    resolver resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock
  ) -> Void {
    if !initialized {
      reject(nil, "Zendesk instance not initialized", nil)
      return
    }

    DispatchQueue.main.async {
      guard let viewController = ZendeskNativeModule.shared.getMessagingViewController(),
            let rootController = RCTPresentedViewController() else {
        reject(nil, "cannot open messaging view", nil)
        return
      }

      if let navigationController = rootController.navigationController {
        navigationController.pushViewController(viewController, animated: true)
      } else {
        let navigationController = UINavigationController(rootViewController: viewController)
        rootController.present(navigationController, animated: true, completion: nil)
      }
      resolve(nil)
    }
  }

  @objc(closeMessagingView:rejecter:)
  func closeMessagingView(
    resolver resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock
  ) -> Void {
    if !initialized {
      reject(nil, "Zendesk instance not initialized", nil)
      return
    }

    DispatchQueue.main.async {
      guard let rootViewController = UIApplication.shared.keyWindow?.rootViewController else {
        reject(nil, "cannot close messaging view", nil)
        return
      }
      rootViewController.dismiss(animated: true, completion: nil)
      resolve(nil)
    }
  }

  @objc(sendPageViewEvent:resolver:rejecter:)
  func sendPageViewEvent(
    event: [String: String],
    resolver resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock
  ) -> Void {
    if !initialized {
      reject(nil, "Zendesk instance not initialized", nil)
      return
    }
    let pageTitle = event["pageTitle"]
    let url = event["url"]

    ZendeskNativeModule.shared.sendPageViewEvent(pageTitle: pageTitle!, url: url!) { result in
      switch result {
      case .success:
        resolve(nil)
      case .failure(let error):
        reject(nil, error.localizedDescription, nil)
      }
    }
  }

  @objc(setConversationFields:)
  func setConversationFields(fields: [String: AnyHashable]) -> Void {
    if !initialized {
      return
    }

    ZendeskNativeModule.shared.setConversationFields(fields)
  }

  @objc(clearConversationFields)
  func clearConversationFields() -> Void {
    if !initialized {
      return
    }

    ZendeskNativeModule.shared.clearConversationFields()
  }

  @objc(setConversationTags:)
  func setConversationTags(tags: [String]) -> Void {
    if !initialized {
      return
    }

    ZendeskNativeModule.shared.setConversationTags(tags)
  }

  @objc(clearConversationTags)
  func clearConversationTags() -> Void {
    if !initialized {
      return
    }

    ZendeskNativeModule.shared.clearConversationTags()
  }

  @objc(getUnreadMessageCount:rejecter:)
  func getUnreadMessageCount(
    resolver resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock
  ) -> Void {
    if !initialized {
      reject(nil, "Zendesk instance not initialized", nil)
      return
    }

    resolve(ZendeskNativeModule.shared.getUnreadMessageCount() ?? 0)
  }
}
