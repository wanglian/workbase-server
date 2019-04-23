# WorkBase

## Workbase 是什么？

- 可以把它当成 Slack。
- 更方便的是，可以启用邮件功能，收发邮件。
- 重点是，部署在自己的服务器上，拥有自己的数据！

## 安装

[简单安装](./install-simple-zh-CN.md)

[![从Snap Store获取](https://snapcraft.io/static/images/badges/en/snap-store-black.svg)](https://snapcraft.io/workbase-server)

前提条件
- Ubuntu Server 16.04(或以上)

使用Snap安装
```
 sudo snap install workbase-server
```
完成后即可访问 `http://<服务器地址>:3000`
初次访问需要完成系统设置。说明如下。
  
### 配置 ROOT_URL

为访问方便，可以给服务器配置域名。
```
 $ sudo snap run --shell workbase-server
 # echo ROOT_URL=<服务器 root url> > $SNAP_COMMON/root-url.env
 $ sudo reboot
```

### (可选) 启用邮件服务（使用 Mailgun）

- 注册Mailgun帐号: https://www.mailgun.com
- 登录Mailgun，添加域名并按照提示步骤完成验证，记录下API Key。
- 添加路由: Match Recipient: `(.*)@<your domain>`, Store and Notify: `<服务器 root url>/api/v1/mailgun`.

### (可选) 使用 Amazon S3

参考该文章完成S3设置 https://vincetocco.com/backup-your-servers-automatically-to-amazon-aws-s3/。  
需要如下参数用于系统设置
- region
- bucket名称
- Access Key Id
- Secret Key

## iOS APP

[![从App Store安装](https://user-images.githubusercontent.com/551004/29770691-a2082ff4-8bc6-11e7-89a6-964cd405ea8e.png)](https://itunes.apple.com/app/workbase/id1447713624)

安装完成后，在”设置“里找到WorkBase，设置服务器地址，如: https://example.com。  
确认登录页面显示的是你设置使用的邮箱域名（需要重启APP）。