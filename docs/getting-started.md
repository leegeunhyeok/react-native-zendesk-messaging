# Getting Started

## Index

- [Android](#android)
- [iOS](#ios)
- [Push Notifications](#push-notifications)

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

---

You can override SDK version like this

```gradle
// Your root build.gradle
buildscript {
  ext {
    ...
    zendeskSdkVersion = "2.3.0" // default version is "2.3.0"
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

## iOS

https://developer.zendesk.com/documentation/zendesk-web-widget-sdks/sdks/ios/getting_started

- Step 1. Install pods
  ```sh
  cd ios && pod install
  ```

## Push Notifications

- [Android guide](./android-push-notifications.md)
- [iOS guide](./ios-push-notifications.md)
