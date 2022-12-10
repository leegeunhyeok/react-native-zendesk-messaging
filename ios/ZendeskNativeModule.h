#import <UserNotifications/UserNotifications.h>

@class ZendeskNativeModule;

@interface ZendeskNativeModule : NSObject
+ (void)updatePushNotificationToken:(NSData *)token;
+ (BOOL)handleNotification:(id)userInfo completionHandler:(void (^)(UNNotificationPresentationOptions))completionHandler;
@end
