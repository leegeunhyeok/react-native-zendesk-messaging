require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))
sdk_version = package["sdkVersions"]["ios"]

folly_compiler_flags = '-DFOLLY_NO_CONFIG -DFOLLY_MOBILE=1 -DFOLLY_USE_LIBCPP=1 -Wno-comma -Wno-shorten-64-to-32'

Pod::Spec.new do |s|
  s.name         = "react-native-zendesk-messaging"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.homepage     = package["homepage"]
  s.license      = package["license"]
  s.authors      = package["author"]

  s.platforms    = { :ios => "11.0" }
  s.source       = { :git => "https://github.com/leegeunhyeok/react-native-zendesk-messaging.git", :tag => "#{s.version}" }

  s.source_files = "ios/**/*.{h,m,mm,swift}"

  if defined?($ZendeskSDKVersion)
    Pod::UI.puts "#{s.name}: Using user specified Zendesk messaging SDK version '#{$ZendeskSDKVersion}'"
    sdk_version = $ZendeskSDKVersion
  end

  s.dependency "React-Core"

  # If you want to change Zendesk SDK version, see the document below.
  # https://github.com/leegeunhyeok/react-native-zendesk-messaging/blob/master/docs/getting-started.md#overriding-sdk-versions
  s.dependency "ZendeskSDKMessaging", sdk_version

  # Don't install the dependencies when we run `pod install` in the old architecture.
  if ENV['RCT_NEW_ARCH_ENABLED'] == '1' then
    s.compiler_flags = folly_compiler_flags + " -DRCT_NEW_ARCH_ENABLED=1"
    s.pod_target_xcconfig    = {
        "HEADER_SEARCH_PATHS" => "\"$(PODS_ROOT)/boost\"",
        "OTHER_CPLUSPLUSFLAGS" => "-DFOLLY_NO_CONFIG -DFOLLY_MOBILE=1 -DFOLLY_USE_LIBCPP=1",
        "CLANG_CXX_LANGUAGE_STANDARD" => "c++17"
    }
    s.dependency "React-Codegen"
    s.dependency "RCT-Folly"
    s.dependency "RCTRequired"
    s.dependency "RCTTypeSafety"
    s.dependency "ReactCommon/turbomodule/core"
  end
end
