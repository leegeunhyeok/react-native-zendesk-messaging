# Getting Started

## Index

- [Android](#android)
- [iOS](#ios)
- [Overriding SDK versions](#overriding-sdk-versions)
- [Push Notifications](#push-notifications)
- [Known Issues](#known-issues)

## Requirements

- `>= TypeScript 3.8`

## Android

https://developer.zendesk.com/documentation/zendesk-web-widget-sdks/sdks/android/getting_started

- Step 1. Add required permissions to your [AndroidManifest.xml](./example/android/app/src/main/AndroidManifest.xml)
  ```xml
  <manifest xmlns:android="http://schemas.android.com/apk/res/android"
          package="com.domain.app">

    <!-- Need android.permission.INTERNET, android.permission.ACCESS_NETWORK_STATE -->
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />

  </manifest>
  ```
- Step 2. Add repository into your root [build.gradle](./example/android/build.gradle)
  ```gradle
  allprojects {
    repositories {
      ...

      // Add this repository
      maven {
        url "https://zendesk.jfrog.io/artifactory/repo"
      }
    }
  }
  ```

## iOS

https://developer.zendesk.com/documentation/zendesk-web-widget-sdks/sdks/ios/getting_started

- Step 1. Install pods
  ```sh
  cd ios && pod install
  ```

## Overriding SDK versions

### Android

```gradle
// android/build.gradle
buildscript {
  ext {
    ...
    zendeskSdkVersion = "2.11.0" // default version is "2.13.0"
  }
}
```

- SDK Versions
  - `>= 2.3.0`
    - Kotlin version: 1.5.31
    - SDK target and compiles: API 31
  - `>= 2.7.0`
    - Kotlin version: 1.6.x
- For more details, checkout [release notes](https://developer.zendesk.com/documentation/zendesk-web-widget-sdks/sdks/android/release_notes)

### iOS


```ruby
...
# ios/Podfile

$ZendeskSDKVersion = '2.11.0' # default version is '2.13.0'
```

## Push Notifications

- [Android guide](./android-push-notifications.md)
- [iOS guide](./ios-push-notifications.md)

## Known Issues

- Android
  - [SDK Docs](https://developer.zendesk.com/documentation/zendesk-web-widget-sdks/sdks/android/known_issues)
  - ProGuard issue on Android
    - Crash log
    ```
    java.lang.NoSuchFieldException: CONVERSATION_START
    AssertionError: Missing field in in.a
    ```
    - Add rule to your `proguard-rules.pro`
    ```
    -keepnames class zendesk.** { *; }
    ```
- iOS
  - [SDK Docs](https://developer.zendesk.com/documentation/zendesk-web-widget-sdks/sdks/ios/known_issues)
