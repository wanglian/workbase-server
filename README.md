![WorkBase logo](https://www.weaworking.com/assets/workbase.png)

# Communication & Collaboration Platform for Team

## Features

- BYOS (Bring Your Own Server)
- Emails
- Messages
- Groups
- Markdown
- Files
- Full text search
- Live chat
- I18n
- Mobile & PC apps

## Deployment

[![Get it from the Snap Store](https://snapcraft.io/static/images/badges/en/snap-store-black.svg)](https://snapcraft.io/workbase-server)

Instant Server Installation with Snap
```
sudo snap install workbase-server --edge --devmode // early test version
```
Now you can access from `http://<server ip>:3000`
  
### Config ROOT_URL

```
$ sudo snap run --shell workbase-server
# echo ROOT_URL=<your server root url> > $SNAP_COMMON/root-url.env
$ sudo reboot
```

### (Optional) Enable Email (Send & Receive)

- Register an account in Mailgun: https://www.mailgun.com.
- Add a domain, and validate following the instructions. Write down the API Key which will be used in setup.
- Add a router: Match Recipient: `(.*)@<your domain>`, Store and Notify: `<your server root url>/api/v1/mailgun`.

### (Optional) Use S3

Follow the steps from https://vincetocco.com/backup-your-servers-automatically-to-amazon-aws-s3/
- Create an S3 bucket in preferred region
- Get an "Access Key Id" and "Secret Key"
