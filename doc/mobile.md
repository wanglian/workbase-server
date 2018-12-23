# Mobile APP

## iOS

```
meteor add-platform ios

meteor add cordova:cordova-plugin-camera@4.0.2
meteor add cordova:cordova-plugin-device@2.0.2
meteor add cordova:cordova-plugin-splashscreen@5.0.2
meteor add cordova:cordova-plugin-statusbar@2.4.2
meteor add cordova:cordova.plugins.diagnostic@4.0.10
meteor add cordova:phonegap-plugin-push@2.2.3

meteor run ios-device --settings settings.json --mobile-server=https://www.weaworking.com
// 在XCode中配置
// 1 签名
// 2 添加几个lib（解决link问题）
```

## Hot Code Push

```
meteor build ../workbase-app --server=http://xxx.com // 加上server参数，跟server的ROOT_URL设置对应
```

## Apple开发者帐号设置

- Certificate: 上传CSR
- Identifier: 应用标识
- Provisioning Profile： 建立应用与设备的关系

## apn配置

https://github.com/raix/push/blob/master/docs/IOS.md
https://stackoverflow.com/questions/9418661/how-to-create-p12-certificate-for-ios-distribution

0 生成p12文件
```
Your private key is generated when you created the signing request in Keychain Access. After the cert is generated and downloaded, double-clicking it will add it to Keychain Access where it will be matched up with the private key. You can then select the cert, and open the arrow to also select the private key and export them together as a .p12 file from Keychain Access.
// 可以不设置密码
```
1 准备三个文件
- CSR
- p12
- aps cer
2 生成cert.pem和key.pem
```
openssl x509 -in aps_development.cer -inform der -out workbase-push-dev-cert.pem
openssl pkcs12 -nocerts -in workbase-dev.p12 -out workbase-push-dev-key.pem // 需要设置密码
```
验证
```
telnet gateway.sandbox.push.apple.com 2195
openssl s_client -connect gateway.sandbox.push.apple.com:2195 -cert workbase-push-dev-cert.pem -key workbase-push-dev-key.pem
// Verify return code: 0 (ok)
```

## Issues

### 头像图片显示异常，css失去控制

https://github.com/meteor-utilities/avatar

```
However, since the CSS isn't generated when you build the project, you won't have any styling for Cordova apps (until they talk to the server). In this case you'll need to provide your own CSS for the avatars.
```

将生成的CSS放在项目文件中

### Hot Code Push not working?

```
2018-12-23 11:13:26.027477-0500 WorkBase[36883:7113363] Using APNS Notification
2018-12-23 11:13:26.075132-0500 WorkBase[36883:7113175] Push Plugin register success: <ef4cbbd8 c55f6c8c 15361894 014eba3e dc021097 b8120b55 cb664788 41965dc3>
2018-12-23 11:13:26.276083-0500 WorkBase[36883:7113175] Start downloading asset manifest from: manifest.json -- https://www.weaworking.com/__cordova/
2018-12-23 11:13:26.451735-0500 WorkBase[36883:7113303] Downloaded asset manifest for version: 13a3d4953041b979d85851380f402ec5e580782b
2018-12-23 11:13:26.477059-0500 WorkBase[36883:7113303] Download failure: Could not link to cached asset: Error Domain=NSCocoaErrorDomain Code=516 "“skin-red-light.min.css” couldn’t be linked to “skins” because an item with the same name already exists." UserInfo={NSSourceFilePathErrorKey=/var/mobile/Containers/Data/Application/CF0B6181-5E77-4A75-8E37-4C65D246B1AB/Library/NoCloud/meteor/PartialDownload/packages/mfactory_admin-lte/css/skins/skin-red-light.min.css, NSUserStringVariant=(
    Link
), NSDestinationFilePath=/var/mobile/Containers/Data/Application/CF0B6181-5E77-4A75-8E37-4C65D246B1AB/Library/NoCloud/meteor/Downloading/packages/mfactory_admin-lte/css/skins/skin-red-light.min.css, NSFilePath=/var/mobile/Containers/Data/Application/CF0B6181-5E77-4A75-8E37-4C65D246B1AB/Library/NoCloud/meteor/PartialDownload/packages/mfactory_admin-lte/css/skins/skin-red-light.min.css, NSUnderlyingError=0x282a94030 {Error Domain=NSPOSIXErrorDomain Code=17 "File exists"}}
2018-12-23 11:13:26.484305-0500 WorkBase[36883:7113175] ERROR: {"line":36,"column":30,"sourceURL":"http://localhost:12880/plugins/cordova-plugin-meteor-webapp/www/webapp_local_server.js"}
```
https://github.com/meteor/cordova-plugin-meteor-webapp/pull/59#issuecomment-439452835
https://stackoverflow.com/questions/53857422/hot-code-push-broken-in-meteor-1-8-cordova-apps-on-ios
