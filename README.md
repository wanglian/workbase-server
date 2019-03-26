![WorkBase logo](https://www.weaworking.com/assets/workbase.png)

[中文](./zh-cn/README.md)

# Email-Based Messaging Hub

## Bring your own server

You'll have the following features and even more
- Emails
- Chats
- Groups
- Channels
- Mobile App

## Install on Ubuntu 16.04

[![Get it from the Snap Store](https://snapcraft.io/static/images/badges/en/snap-store-black.svg)](https://snapcraft.io/workbase-server)

Instant Server Installation with Snap
```
sudo snap install workbase-server
```
Now you can access from `http://<your server ip>:3000`
  
### Config ROOT_URL

Suppose you have a domain(ex: example.com) mapping to your server.
```
$ sudo snap run --shell workbase-server
# echo ROOT_URL=https://example.com > $SNAP_COMMON/root-url.env
$ sudo reboot
```

### (Optional) Enable Email (Send & Receive)

- Register an account in Mailgun: https://www.mailgun.com.
- Add a domain, and validate following the instructions. Write down the API Key which will be used in setup.
- Add a router: Match Recipient: `(.*)@example.com`, Store and Notify: `https://example.com/api/v1/mailgun`.

### (Optional) Use S3

Follow the steps from https://vincetocco.com/backup-your-servers-automatically-to-amazon-aws-s3/
- Create an S3 bucket in preferred region
- Get an "Access Key Id" and "Secret Key"

## iOS App

[![Install from App Store](https://user-images.githubusercontent.com/551004/29770691-a2082ff4-8bc6-11e7-89a6-964cd405ea8e.png)](https://itunes.apple.com/app/workbase/id1447713624)

After installation, set Server address(ex: https://example.com) from Settings.  
Make sure the login screen showing your domain.
