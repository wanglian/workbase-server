# WorkBase 简单安装

需要用到
- Ubuntu Server 16.04（或以上）
- [Mailgun](https://mailgun.com)
- [ngrok](https://ngrok.com)
- [WorkBase](https://snapcraft.io/workbase-server)

## 设置 Mailgun

WorkBase使用 [mailgun](https://mailgun.com) 收发邮件。 你可以免费注册一个mailgun帐号，免费使用（每个月超过10000封邮件才需要付费）。  
你要有一个自己的域名(比如：example.com)，把它添加到mailgun，并按提示完成域名验证。记录下API key，在WorkBase初始化设置时会用到。  
在完成WorkBase安装后再回来配置Route（路由），将收到的邮件转发到 WorkBase。
- Match Recipient: `(.*)@example.com`
- Store and Notify: `https://xxxxxxxx.ngrok.io/api/v1/mailgun`

## 安装 WorkBase

Ubuntu (Server) 16.04（或以上）
```
sudo snap install workbase-server
```
完成后即可访问 `http://<地址>:3000`，进入初始化设置  
第一步 ”企业基本信息“，“域名”填写在mailgun验证的域名。  
第二步 ”邮箱功能“，填写mailgun获得的key。  
第三步 ”文件存储方式“，选择默认的本地存储。  
第三步 设置管理员帐号。

## 配置域名解析

[你可以将自己的域名解析到该服务器，使用Web Server（nginx或apache等），配置ssl，反向代理到3000端口。]  
最简单的方式是使用 [ngrok](https://ngrok.com)。下载安装，然后执行
```
$ ./ngrok http 3000
...
Web Interface                 http://127.0.0.1:4040
Forwarding                    http://xxxxxxxx.ngrok.io -> localhost:3000         
Forwarding                    https://xxxxxxxx.ngrok.io -> localhost:3000 
```
即可得到一个免费域名，以及https连接 https://xxxxxxxx.ngrok.io。

## 配置 ROOT URL

```
 $ sudo snap run --shell workbase-server
 # echo ROOT_URL=https://xxxxxxxx.ngrok.io > $SNAP_COMMON/root-url.env
 # exit
 $ sudo reboot
```

## iOS APP

[![从App Store安装](https://user-images.githubusercontent.com/551004/29770691-a2082ff4-8bc6-11e7-89a6-964cd405ea8e.png)](https://itunes.apple.com/app/workbase/id1447713624)

安装完成后，在”设置“里找到WorkBase，设置服务器地址，如: https://xxxxxxxx.ngrok.io。  
打开APP(需要重启)，确认登录页面显示的是你设置使用的邮箱域名。
