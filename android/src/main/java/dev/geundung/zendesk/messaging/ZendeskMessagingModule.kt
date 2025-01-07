package dev.geundung.zendesk.messaging

import android.content.Intent
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.WritableMap
import com.facebook.react.modules.core.DeviceEventManagerModule
import zendesk.android.events.ZendeskEvent
import zendesk.android.pageviewevents.PageView
import zendesk.messaging.android.DefaultMessagingFactory

class ZendeskMessagingModule(private val reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext) {
  private val module: ZendeskNativeModule = ZendeskNativeModule.getInstance()
  private var initialized = false

  override fun getName(): String {
    return NAME
  }

  private fun sendEvent(eventName: String, params: WritableMap?) {
    reactContext
      .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
      .emit(eventName, params)
  }

  private fun setupEventObserver() {
    module.addEventListener(
      listener = {
          zendeskEvent ->
        when (zendeskEvent) {
          is ZendeskEvent.UnreadMessageCountChanged -> {
            val event: WritableMap = Arguments.createMap()
            event.putDouble("unreadCount", zendeskEvent.currentUnreadCount.toDouble())
            sendEvent("unreadMessageCountChanged", event)
          }
          is ZendeskEvent.AuthenticationFailed -> {
            val event: WritableMap = Arguments.createMap()
            event.putString("reason", zendeskEvent.error.message)
            sendEvent("authenticationFailed", event)
          }
          else -> {}
        }
      },
    )
  }

  @ReactMethod
  fun initialize(config: ReadableMap, promise: Promise) {
    if (initialized) {
      promise.resolve(null)
      return
    }
    val channelKey = config.getString("channelKey") as String

    module.initialize(
      context = reactContext,
      channelKey = channelKey,
      successCallback = { _ ->
        setupEventObserver()
        initialized = true
        promise.resolve(null)
      },
      failureCallback = { error -> promise.reject("initialize", error.toString()) },
      messagingFactory = DefaultMessagingFactory(),
    )
  }

  @ReactMethod
  fun reset() {
    module.reset()
    initialized = false
  }

  @ReactMethod
  fun login(token: String, promise: Promise) {
    if (!initialized) {
      promise.reject("login", "Zendesk instance not initialized")
      return
    }

    module.loginUser(
      token = token,
      successCallback = { user ->
        val data: WritableMap = Arguments.createMap()
        data.putString("id", user.id)
        data.putString("externalId", user.externalId)
        promise.resolve(data)
      },
      failureCallback = { error -> promise.reject("login", error.toString()) },
    )
  }

  @ReactMethod
  fun logout(promise: Promise) {
    if (!initialized) {
      promise.reject("logout", "Zendesk instance not initialized")
      return
    }

    module.logoutUser(
      successCallback = { _ -> promise.resolve(null) },
      failureCallback = { error -> promise.reject(error) },
    )
  }

  @ReactMethod
  fun openMessagingView(promise: Promise) {
    if (!initialized) {
      promise.reject("openMessagingView", "Zendesk instance not initialized")
      return
    }

    module.showMessaging(reactContext, Intent.FLAG_ACTIVITY_NEW_TASK)

    promise.resolve(null)
  }

  @ReactMethod
  fun sendPageViewEvent(event: ReadableMap, promise: Promise) {
    if (!initialized) {
      promise.reject("sendPageViewEvent", "Zendesk instance not initialized")
      return
    }
    val pageTitle = event.getString("pageTitle") as String
    val url = event.getString("pageTitle") as String
    val pageView = PageView(url = url, pageTitle = pageTitle)

    module.sendPageViewEvent(
      pageView = pageView,
      successCallback = { _ -> promise.resolve(null) },
      failureCallback = { error -> promise.reject(error) },
    )
  }

  @ReactMethod
  fun setConversationFields(fields: ReadableMap) {
    if (!initialized) {
      return
    }

    fields.toHashMap()
      .filterValues { it != null }
      .mapValues { it.value!! }
      .let { module.setConversationFields(it) }
  }

  @ReactMethod
  fun clearConversationFields() {
    if (!initialized) {
      return
    }

    module.clearConversationFields()
  }

  @ReactMethod
  fun setConversationTags(tags: ReadableArray) {
    if (!initialized) {
      return
    }

    val convertedTags: MutableList<String> = mutableListOf()
    tags.toArrayList().forEach {
      if (it is String) convertedTags.add(it)
    }

    module.setConversationTags(convertedTags)
  }

  @ReactMethod
  fun clearConversationTags() {
    if (!initialized) {
      return
    }

    module.clearConversationTags()
  }

  @ReactMethod
  fun updatePushNotificationToken(newToken: String) {
    module.updatePushNotificationToken(newToken)
  }

  @ReactMethod
  fun getUnreadMessageCount(promise: Promise) {
    if (!initialized) {
      promise.reject("getUnreadMessageCount", "Zendesk instance not initialized")
      return
    }

    promise.resolve(module.getUnreadMessageCount() ?: 0)
  }

  @ReactMethod
  fun handleNotification(remoteMessage: ReadableMap, promise: Promise) {
    try {
      val messageData: Map<String, String> = remoteMessage.toHashMap()
        .filterValues { it is String }
        .mapValues { it.value as String }
        .toMap()

      module.handleNotification(
        context = reactContext,
        messageData = messageData,
      ) { responsibility -> promise.resolve(responsibility) }
    } catch (error: Exception) {
      promise.reject("handleNotification", error.toString())
    }
  }

  @ReactMethod
  fun addListener(type: String?) {
      // noop
  }

  @ReactMethod
  fun removeListeners(type: Int?) {
      // noop
  }

  companion object {
    const val NAME = "ZendeskMessaging"
  }
}
