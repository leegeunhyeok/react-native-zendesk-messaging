#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(ZendeskMessaging, NSObject)

RCT_EXTERN_METHOD(supportedEvents)

RCT_EXTERN_METHOD(initialize:(NSDictionary*)config
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(reset)

RCT_EXTERN_METHOD(login:(NSString*)token
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(logout:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(openMessagingView:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(closeMessagingView:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(sendPageViewEvent:(NSDictionary*)event
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(setConversationFields:(NSDictionary*)fields)
RCT_EXTERN_METHOD(clearConversationFields)

RCT_EXTERN_METHOD(setConversationTags:(NSArray*)tags)
RCT_EXTERN_METHOD(clearConversationTags)

RCT_EXTERN_METHOD(getUnreadMessageCount:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

+ (BOOL)requiresMainQueueSetup
{
  return NO;
}

@end
