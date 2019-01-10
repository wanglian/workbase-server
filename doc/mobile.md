# Mobile APP

- [Cordova](https://cordova.apache.org/docs/en/latest/config_ref/index.html#preference)

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

### 头像图片显示异常，css失去控制(done)

https://github.com/meteor-utilities/avatar

```
However, since the CSS isn't generated when you build the project, you won't have any styling for Cordova apps (until they talk to the server). In this case you'll need to provide your own CSS for the avatars.
```

将生成的CSS放在项目文件中

### Hot Code Push not working?(done)

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

### APP Hot Code Push问题

如果APP统一上架应用商店，但实际上需要连接各自的Server，并且从各自的Server上获取新代码。
https://stackoverflow.com/questions/30680804/configure-meteor-mobile-app-to-connect-to-different-server-at-runtime

https://geeklearning.io/how-to-add-specific-configuration-parameters-to-ios-p-list-and-android-manifest/

iOS Settings Bundle
https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/UserDefaults/AccessingPreferenceValues/AccessingPreferenceValues.html#//apple_ref/doc/uid/10000059i-CH3-SW1
https://github.com/apla/me.apla.cordova.app-preferences

Cordova框架理解
https://www.cnblogs.com/cr330326/p/7082821.html


### 打开本地相册，多了一层


### APP个人设置Modal，不能显示底部按钮(done)

WEB没问题。

### APP样式问题：搜索框不能自动focus(done)，不能固定在顶部

在开发环境，浏览器不能复现。
因为键盘打开，页面滚动。

KeyboardShrinksView 这个配置已弃用。

https://medium.com/@im_rahul/safari-and-position-fixed-978122be5f29
https://benfrain.com/preventing-body-scroll-for-modals-in-ios/
https://github.com/lazd/iNoBounce
http://luxiyalu.com/how-to-prevent-body-from-scrolling/
https://benfrain.com/preventing-body-scroll-for-modals-in-ios/

解决
https://github.com/onderceylan/cordova-plugin-wkwebview-inputfocusfix
同时使用
https://github.com/apache/cordova-plugin-wkwebview-engine
提供了三个配置
- CordovaWebViewEngine: CDVWKWebViewEngine
- AllowBackForwardNavigationGestures: true
- Allow3DTouchLinkPreview: false

### 消息里的超链接打不开(done)

考虑使用
https://github.com/apache/cordova-plugin-inappbrowser

```
let renderer = new Markdown.Renderer();
renderer.link = function(href, title, text) {
  href = `javascript: window.open('${href}', '_blank')`;
  return Markdown.Renderer.prototype.link.call(this, href, title, text);
};

Markdown.setOptions({
  renderer: renderer
});
```

### 页面滚动不顺滑(done)

momentum-scrolling 概念

```
-webkit-overflow-scrolling: touch
```

### iOS点顶部状态栏页面回到顶部？(done)

https://stackoverflow.com/questions/10715052/phonegap-scroll-top-on-statusbar-tap

cordova-plugin-statusbar 提供了事件

```
window.addEventListener('statusTap', function() {
  $('.scroll-box').animate({ scrollTop: 0 }, "fast");
});
```
将需要滚动的区块加上 scroll-box

### 邮件内的链接在APP上点不开（done）

https://issues.apache.org/jira/browse/CB-10753
InAppBrowser will not work with iframe embedded

https://stackoverflow.com/questions/37727960/how-to-open-a-new-window-by-a-link-within-an-iframe#38072439
这个帖子下面提到了这个插件 https://github.com/trendsales/cordova-iframe-navigation
装上后可以了，甚至不需要对a.href做window.open处理，直接会在手机的浏览器打开。
但是安装插件有点问题，这个插件没有打TAG，不能指定版本号。于是通过github地址安装，但是
```
While installing Cordova plugins:
   error: Meteor no longer supports installing Cordova plugins from arbitrary tarball URLs. You can
   either add a plugin from a Git URL with a SHA reference, or from a local path. (Attempting to
   install from
   https://github.com/trendsales/cordova-iframe-navigation/commit/4c276b668488f94a52087e27dc84e49314ad28f9.)
```
但还是通过tarball安装上了
```
https://github.com/trendsales/cordova-iframe-navigation/tarball/4c276b668488f94a52087e27dc84e49314ad28f9
```
没有明白 a Git URL with a SHA reference 是什么意思。
https://developer.github.com/v3/git/refs/

同时要打开cordova设置
```
App.accessRule('*', {type: 'intent'});
App.accessRule('*', {type: 'navigation'});
```

https://github.com/apache/cordova-plugin-whitelist

