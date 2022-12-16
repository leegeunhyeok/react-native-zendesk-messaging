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
    config: [String: String],
    resolver resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock
  ) -> Void {
    if initialized {
      resolve(nil)
      return
    }

    let channelKey = config["channelKey"]
    if channelKey == nil || channelKey!.isEmpty {
      reject(nil, "channelKey is empty", nil)
      return
    }

    ZendeskNativeModule.shared.initialize(
      withChannelKey: channelKey!,
      messagingFactory: DefaultMessagingFactory()
    ) { result in
      switch result {
      case .success(let zendesk):
        self.setupEventObserver(withInstance: zendesk)
        self.initialized = true
        resolve(nil)
      case .failure(let error):
        reject(nil, "initialize failed", error)
      }
    }
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
            let rootController = UIApplication.shared.windows.first!.rootViewController else {
        reject(nil, "cannot open messaging view", nil)
        return
      }
      rootController.show(viewController, sender: self)
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
    if pageTitle == nil || url == nil {
      reject(nil, "invalid page view event", nil)
      return
    }

    ZendeskNativeModule.shared.sendPageViewEvent(pageTitle: pageTitle!, url: url!) { result in
      switch result {
      case .success:
        resolve(nil)
      case .failure(let error):
        reject(nil, error.localizedDescription, nil)
      }
    }
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
