package dev.geundung.zendesk.messaging

import android.content.Context
import zendesk.android.FailureCallback
import zendesk.android.SuccessCallback
import zendesk.android.Zendesk
import zendesk.android.ZendeskUser
import zendesk.android.events.ZendeskEventListener
import zendesk.android.messaging.MessagingFactory
import zendesk.android.pageviewevents.PageView
import zendesk.messaging.android.push.PushNotifications
import zendesk.messaging.android.push.PushResponsibility

class ZendeskNativeModule private constructor() {
  companion object {
    private var instance: ZendeskNativeModule? = null

    @JvmStatic
    fun getInstance(): ZendeskNativeModule {
      return instance ?: synchronized(this) {
        instance ?: ZendeskNativeModule().also {
          instance = it
        }
      }
    }
  }

  fun initialize(
    context: Context,
    channelKey: String,
    successCallback: SuccessCallback<Zendesk>,
    failureCallback: FailureCallback<Throwable>,
    messagingFactory: MessagingFactory?,
  ) = Zendesk.initialize(
    context = context,
    channelKey = channelKey,
    successCallback = successCallback,
    failureCallback = failureCallback,
    messagingFactory = messagingFactory,
  )

  fun reset() = Zendesk.invalidate()

  fun addEventListener(listener: ZendeskEventListener) = Zendesk.instance.addEventListener(listener)

  fun loginUser(
    token: String,
    successCallback: SuccessCallback<ZendeskUser>,
    failureCallback: FailureCallback<Throwable>,
  ) = Zendesk.instance.loginUser(token, successCallback, failureCallback)

  fun logoutUser(
    successCallback: SuccessCallback<Unit>,
    failureCallback: FailureCallback<Throwable>,
  ) = Zendesk.instance.logoutUser(successCallback, failureCallback)

  fun showMessaging(context: Context, intentFlags: Int) =
    Zendesk.instance.messaging.showMessaging(context, intentFlags)

  fun sendPageViewEvent(
    pageView: PageView,
    successCallback: SuccessCallback<Unit>,
    failureCallback: FailureCallback<Throwable>,
  ) = Zendesk.instance.sendPageView(pageView, successCallback, failureCallback)

  fun setConversationFields(
    fields: Map<String, Any>,
  ) = Zendesk.instance.messaging.setConversationFields(fields)

  fun clearConversationFields() = Zendesk.instance.messaging.clearConversationFields()

  fun setConversationTags(tags: List<String>) = Zendesk.instance.messaging.setConversationTags(tags)

  fun clearConversationTags() = Zendesk.instance.messaging.clearConversationTags()

  fun setNotificationSmallIconId(resourceId: Int?) =
    PushNotifications.setNotificationSmallIconId(resourceId)

  fun updatePushNotificationToken(newToken: String) =
    PushNotifications.updatePushNotificationToken(newToken)

  fun getUnreadMessageCount() =
    Zendesk.instance?.messaging?.getUnreadMessageCount()

  fun handleNotification(
    context: Context,
    messageData: Map<String, String>,
    callback: ((String) -> Unit)?,
  ): Boolean {
    var handled = true
    when (PushNotifications.shouldBeDisplayed(messageData)) {
      PushResponsibility.MESSAGING_SHOULD_DISPLAY -> {
        PushNotifications.displayNotification(context, messageData)
        callback?.invoke("MESSAGING_SHOULD_DISPLAY")
      }
      PushResponsibility.MESSAGING_SHOULD_NOT_DISPLAY -> {
        callback?.invoke("MESSAGING_SHOULD_NOT_DISPLAY")
      }
      PushResponsibility.NOT_FROM_MESSAGING -> {
        callback?.invoke("NOT_FROM_MESSAGING")
        handled = false
      }
      else -> {
        callback?.invoke("UNKNOWN")
        handled = false
      }
    }

    return handled
  }
}
