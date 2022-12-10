package dev.geundung.zendeskmessaging

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise

class ZendeskMessagingModule(reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext) {

  override fun getName(): String {
    return NAME
  }

  @ReactMethod
  fun initialize(config: Map<String, String>, promise: Promise) {
    promise.resolve(null)
  }

  @ReactMethod
  fun login(token: String, promise: Promise) {
    promise.resolve(null)
  }

  @ReactMethod
  fun logout(promise: Promise) {
    promise.resolve(null)
  }

  @ReactMethod
  fun showMessagingView(promise: Promise) {
    promise.resolve(null)
  }

  companion object {
    const val NAME = "ZendeskMessaging"
  }
}
