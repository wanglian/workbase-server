# Mobile APP

## iOS

```
meteor add-platform ios
```

## Apple开发者帐号设置

- Certificate

上传CSR

- Identifier

应用标识

- Provisioning Profile

建立应用与设备的关系


## Issues

### 头像图片显示异常，css失去控制

https://github.com/meteor-utilities/avatar

```
However, since the CSS isn't generated when you build the project, you won't have any styling for Cordova apps (until they talk to the server). In this case you'll need to provide your own CSS for the avatars.
```

将生成的CSS放在项目文件中
