#import <UserNotifications/UserNotifications.h>

@class ZendeskNativeModule;

@interface ZendeskNativeModule : NSObject

@property (nonatomic, class, readonly, strong) ZendeskNativeModule * _Nonnull shared;

+ (ZendeskNativeModule * _Nonnull)shared __attribute__((warn_unused_result));
- (nonnull instancetype)init __attribute__((unavailable));
- (nonnull instancetype)new __attribute__((unavailable("-init is unavailable")));
- (void)updatePushNotificationToken:(NSData * _Nonnull)token;
- (BOOL)handleNotification:(id _Nonnull)userInfo completionHandler:(void (^_Nonnull)(UNNotificationPresentationOptions))completionHandler;

@end
