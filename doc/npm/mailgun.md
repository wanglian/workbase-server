# mailgun-js

https://github.com/bojand/mailgun-js

## 发送内嵌图片(inline)

https://github.com/bojand/mailgun-js/issues/161

```
{
  from:
  to:
  subject:
  html: `<img src="cid:<file name>"/>`,
  inline: image.path // 这里image是Meteor Files对象
}
```

## 收不到带内嵌图片的邮件？body为空{}

https://forums.meteor.com/t/request-too-large-body-empty-when-increasing-limit/15925

```
Router.onBeforeAction(Iron.Router.bodyParser.urlencoded({
  extended: true,
  limit: '100mb'
}), {where: 'server'});
```
bodyParser不支持 multipart/form-data
https://github.com/expressjs/body-parser/issues/88

[Working with Mailgun webhooks](https://hk.saowen.com/a/e14d84715de37c071f9852737e4e80b0d3cb227c1d8a6d9ef4e1377d6ff6a3c4)
[Routing Emails Through Meteor Server](http://ideasintosoftware.com/routing-emails-through-meteor-server/)
[Meteor with Express](http://www.mhurwi.com/meteor-with-express/)

https://github.com/expressjs/multer

代码示例：处理multipart/form-data
```
import express from 'express';
import bodyParser from 'body-parser';
import multer from 'multer';

const app = express();
const router = express.Router();
const upload = multer();

router.post('/api/v1/mailgun', upload.any(), Meteor.bindEnvironment((req, res) => {
  console.log("[mailgun] email received");
  console.log(req.headers['content-type']);
  let body = req.body;
  if (!_.isEmpty(body)) {
    // console.log(body);
    let files = req.files;
    try {
      MailgunEmails.create(body);
    } catch (e) {
      console.log("[mailgun] error:");
      console.log(e);
    }
  }
  res.end("success");
}));

app.use(bodyParser.urlencoded({
  extended: true,
  limit: '50mb'
}));
app.use(router);

// Wire up Meteor.
WebApp.connectHandlers.use(app);
```

## 解析内嵌图片

```
<img src=\"cid:ii_jpshmvmw0\" alt=\"IMG_0196.JPG\" width=\"518\" height=\"347\">
```
params["content-id-map"]中保存cid表
params["attachments"]中保存附件信息，包括inline图片
