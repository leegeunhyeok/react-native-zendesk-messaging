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

## iOS

https://developer.zendesk.com/documentation/zendesk-web-widget-sdks/sdks/ios/getting_started

- Step 1. Install pods
  ```sh
  cd ios && pod install
  ```

## Push Notifications

- [Android guide](./android-push-notification.md)
- [iOS guide](./ios-push-notification.md)
