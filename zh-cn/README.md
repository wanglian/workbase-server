# WorkBase

## Workbase是什么？

- 可以把它当成Slack。
- 如果要跟外部沟通（这几乎是肯定的），可以启用邮件功能。
- 部署在自己服务器上的软件。拥有自己的数据！

## 安装

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

### (可选) 启用邮件服务（使用Mailgun）

- 注册Mailgun帐号: https://www.mailgun.com
- 登录Mailgun，添加域名并按照提示步骤完成验证，记录下API Key。
- 添加路由: Match Recipient: `(.*)@<your domain>`, Store and Notify: `<服务器 root url>/api/v1/mailgun`.

### (可选) 使用Amazon S3

参考该文章完成S3设置 https://vincetocco.com/backup-your-servers-automatically-to-amazon-aws-s3/
需要如下参数用于系统设置
- region
- bucket名称
- Access Key Id
- Secret Key
