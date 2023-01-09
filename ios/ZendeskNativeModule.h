#import <UserNotifications/UserNotifications.h>

@class ZendeskNativeModule;

@interface ZendeskNativeModule : NSObject

+ (void)updatePushNotificationToken:(NSData * _Nonnull)token;
+ (BOOL)showNotification:(id _Nonnull)userInfo completionHandler:(void (^_Nonnull)(UNNotificationPresentationOptions))completionHandler;
+ (BOOL)handleNotification:(id _Nonnull)userInfo completionHandler:(void (^)(void))completionHandler;

@end
