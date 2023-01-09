#import <UserNotifications/UserNotifications.h>

@class ZendeskNativeModule;

@interface ZendeskNativeModule : NSObject

+ (void)updatePushNotificationToken:(NSData * _Nonnull)token;
+ (BOOL)handleNotification:(id _Nonnull)userInfo completionHandler:(void (^_Nonnull)(UNNotificationPresentationOptions))completionHandler;

@end
