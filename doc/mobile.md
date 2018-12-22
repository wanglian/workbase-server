# Mobile APP

## iOS

```
meteor add-platform ios

meteor run ios-device --settings settings.json // --mobile-server=https://www.weaworking.com
// 在XCode中配置
// 1 签名
// 2 添加几个lib（解决link问题）
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
