# Issues

## 1-8

### 不明sub错误

看不到跟代码相关的信息。
原因是publishComposite用混了。用publishComposite但没有按它的返回格式。

```
I20190108-19:11:03.014(-5)? Exception from sub thread id FaqrA6wQyDyG9ZhEq { Error: Match error: Expected plain object
I20190108-19:11:03.014(-5)?     at check (packages/check/match.js:36:17)
I20190108-19:11:03.014(-5)?     at new Publication (packages/reywood:publish-composite/lib/publication.js:11:9)
I20190108-19:11:03.014(-5)?     at instanceOptions.forEach.opt (packages/reywood:publish-composite/lib/publish_composite.js:16:25)
I20190108-19:11:03.014(-5)?     at Array.forEach (<anonymous>)
I20190108-19:11:03.014(-5)?     at Subscription.publish (packages/reywood:publish-composite/lib/publish_composite.js:15:25)
I20190108-19:11:03.014(-5)?     at packages/matb33_collection-hooks.js:307:21
I20190108-19:11:03.014(-5)?     at Meteor.EnvironmentVariable.EVp.withValue (packages/meteor.js:1304:12)
I20190108-19:11:03.015(-5)?     at Subscription._handler (packages/matb33_collection-hooks.js:306:28)
I20190108-19:11:03.015(-5)?     at maybeAuditArgumentChecks (packages/ddp-server/livedata_server.js:1767:12)
I20190108-19:11:03.015(-5)?     at DDP._CurrentPublicationInvocation.withValue (packages/ddp-server/livedata_server.js:1043:15)
I20190108-19:11:03.015(-5)?     at Meteor.EnvironmentVariable.EVp.withValue (packages/meteor.js:1304:12)
I20190108-19:11:03.015(-5)?     at Subscription._runHandler (packages/ddp-server/livedata_server.js:1041:51)
I20190108-19:11:03.015(-5)?     at Session._startSubscription (packages/ddp-server/livedata_server.js:859:9)
I20190108-19:11:03.015(-5)?     at Session.sub (packages/ddp-server/livedata_server.js:625:12)
I20190108-19:11:03.016(-5)?     at packages/ddp-server/livedata_server.js:559:43
I20190108-19:11:03.016(-5)?   message: 'Match error: Expected plain object',
I20190108-19:11:03.016(-5)?   path: '',
I20190108-19:11:03.016(-5)?   sanitizedError:
I20190108-19:11:03.016(-5)?    { Error: Match failed [400]
I20190108-19:11:03.016(-5)?     at errorClass.<anonymous> (packages/check/match.js:91:27)
I20190108-19:11:03.017(-5)?     at new errorClass (packages/meteor.js:725:17)
I20190108-19:11:03.017(-5)?     at check (packages/check/match.js:36:17)
I20190108-19:11:03.017(-5)?     at new Publication (packages/reywood:publish-composite/lib/publication.js:11:9)
I20190108-19:11:03.017(-5)?     at instanceOptions.forEach.opt (packages/reywood:publish-composite/lib/publish_composite.js:16:25)
I20190108-19:11:03.017(-5)?     at Array.forEach (<anonymous>)
I20190108-19:11:03.017(-5)?     at Subscription.publish (packages/reywood:publish-composite/lib/publish_composite.js:15:25)
I20190108-19:11:03.017(-5)?     at packages/matb33_collection-hooks.js:307:21
I20190108-19:11:03.018(-5)?     at Meteor.EnvironmentVariable.EVp.withValue (packages/meteor.js:1304:12)
I20190108-19:11:03.018(-5)?     at Subscription._handler (packages/matb33_collection-hooks.js:306:28)
I20190108-19:11:03.018(-5)?     at maybeAuditArgumentChecks (packages/ddp-server/livedata_server.js:1767:12)
I20190108-19:11:03.018(-5)?     at DDP._CurrentPublicationInvocation.withValue (packages/ddp-server/livedata_server.js:1043:15)
I20190108-19:11:03.018(-5)?     at Meteor.EnvironmentVariable.EVp.withValue (packages/meteor.js:1304:12)
I20190108-19:11:03.018(-5)?     at Subscription._runHandler (packages/ddp-server/livedata_server.js:1041:51)
I20190108-19:11:03.019(-5)?     at Session._startSubscription (packages/ddp-server/livedata_server.js:859:9)
I20190108-19:11:03.019(-5)?     at Session.sub (packages/ddp-server/livedata_server.js:625:12)
I20190108-19:11:03.019(-5)?      isClientSafe: true,
I20190108-19:11:03.019(-5)?      error: 400,
I20190108-19:11:03.019(-5)?      reason: 'Match failed',
I20190108-19:11:03.019(-5)?      details: undefined,
I20190108-19:11:03.019(-5)?      message: 'Match failed [400]',
I20190108-19:11:03.020(-5)?      errorType: 'Meteor.Error' },
I20190108-19:11:03.020(-5)?   errorType: 'Match.Error' }
I20190108-19:11:03.020(-5)? Sanitized and reported to the client as: { Error: Match failed [400]
I20190108-19:11:03.020(-5)?     at errorClass.<anonymous> (packages/check/match.js:91:27)
I20190108-19:11:03.020(-5)?     at new errorClass (packages/meteor.js:725:17)
I20190108-19:11:03.020(-5)?     at check (packages/check/match.js:36:17)
I20190108-19:11:03.020(-5)?     at new Publication (packages/reywood:publish-composite/lib/publication.js:11:9)
I20190108-19:11:03.021(-5)?     at instanceOptions.forEach.opt (packages/reywood:publish-composite/lib/publish_composite.js:16:25)
I20190108-19:11:03.021(-5)?     at Array.forEach (<anonymous>)
I20190108-19:11:03.021(-5)?     at Subscription.publish (packages/reywood:publish-composite/lib/publish_composite.js:15:25)
I20190108-19:11:03.021(-5)?     at packages/matb33_collection-hooks.js:307:21
I20190108-19:11:03.021(-5)?     at Meteor.EnvironmentVariable.EVp.withValue (packages/meteor.js:1304:12)
I20190108-19:11:03.021(-5)?     at Subscription._handler (packages/matb33_collection-hooks.js:306:28)
I20190108-19:11:03.022(-5)?     at maybeAuditArgumentChecks (packages/ddp-server/livedata_server.js:1767:12)
I20190108-19:11:03.022(-5)?     at DDP._CurrentPublicationInvocation.withValue (packages/ddp-server/livedata_server.js:1043:15)
I20190108-19:11:03.022(-5)?     at Meteor.EnvironmentVariable.EVp.withValue (packages/meteor.js:1304:12)
I20190108-19:11:03.022(-5)?     at Subscription._runHandler (packages/ddp-server/livedata_server.js:1041:51)
I20190108-19:11:03.022(-5)?     at Session._startSubscription (packages/ddp-server/livedata_server.js:859:9)
I20190108-19:11:03.022(-5)?     at Session.sub (packages/ddp-server/livedata_server.js:625:12)
I20190108-19:11:03.022(-5)?   isClientSafe: true,
I20190108-19:11:03.023(-5)?   error: 400,
I20190108-19:11:03.023(-5)?   reason: 'Match failed',
I20190108-19:11:03.023(-5)?   details: undefined,
I20190108-19:11:03.023(-5)?   message: 'Match failed [400]',
I20190108-19:11:03.023(-5)?   errorType: 'Meteor.Error' }
```


## 1-4
### 转发消息预览，不能查看邮件内容

看起来原因是在Modal中，iframe初始化时高度计算为0。
https://stackoverflow.com/questions/25565716/load-iframe-in-bootstrap-modal
在modal事件shown.bs.modal中处理
```
$('.modal').on('shown.bs.modal',function(){
  $(this).find('iframe').attr('src','http://www.google.com')
})
```

## 2018
### 用户logout时，meteor会自动更新Users信息。而修改用户日志是监听Users的修改，用户logout信息所以会在管理日志中出现(done)

将日志放在Methods层，即业务层。用户行为日志是利用回调onLogin/onLogout/onLoginFailer，也是业务回调。

- i18n问题：产品环境浏览器正常，APP上week不能显示中文(done)

发现问题是：Chrome正常，Safari不正常。因为iOS APP用的是Safari。
原因是，i18n没有做完整，除了自己使用的i18next，momentjs/status等都要统一处理。已解决

- Markdown链接在新窗口打开(done)

https://github.com/markedjs/marked/pull/1371

```
let renderer = new Markdown.Renderer();
renderer.link = function(href, title, text) {
  let link = Markdown.Renderer.prototype.link.call(this, href, title, text);
  return link.replace("<a","<a target='_blank' ");
};
Markdown.setOptions({
  renderer: renderer
});

```

- 自适应动态布局

https://css-tricks.com/guide-responsive-friendly-css-columns/


- fancybox 不能播放mov格式影片

直接从iphone上传的


- 产品环境下用户切换时右侧内容不变(done)

只有一种情况：从会话视图切换到本人（非会话视图，如果会话视图存在则没问题）
开发环境没问题。
已更改方案，避免此问题。

- ViewerJS显示文件名问题(done)

实现保存的文件名与原文件名是不一致的，而ViewerJS显示的是路径中的文件名。
解决方案是修改模板

```
<div id = "documentName" style="display:none;"></div>
```

- 外发inline图片文件名问题(done)

因为文件保存时使用的随机ID作为文件名，所以在inline中cid设置为这个随机ID。但是这样接收方就丢失了文件名信息。
解决方案是同附件处理，mailgun-js提供了接口。

```
html: `<img src="cid:${image.name}.${image.extension}"/>`,
inline: new Mailgun.client.Attachment({
  data: image.path,
  filename: image.name,
  knownLength: image.size,
  contentType: image.type
}),
```

- 旋转数组(done)
```
const rotateArray = (array, n) => {
  let a = _.clone(array);
  if (n === 0) return;
  if (n < 0) {
    _.times(-n, () => {
      a.push(a.shift());
    });
  } else {
    _.times(n, () => {
      a.unshift(a.pop());
    });
  }
  return a;
};
```

- 转发gmail邮件过来报错(done)
```
W20181213-20:30:49.597(-5)? (STDERR) Error: request entity too large
W20181213-20:30:49.601(-5)? (STDERR)     at makeError (/Users/wanglian/.meteor/packages/iron_router/.1.1.2.rl6539.wj6hk++os+web.browser+web.cordova/npm/node_modules/body-parser/node_modules/raw-body/index.js:154:15)
W20181213-20:30:49.602(-5)? (STDERR)     at readStream (/Users/wanglian/.meteor/packages/iron_router/.1.1.2.rl6539.wj6hk++os+web.browser+web.cordova/npm/node_modules/body-parser/node_modules/raw-body/index.js:188:15)
W20181213-20:30:49.602(-5)? (STDERR)     at getRawBody (/Users/wanglian/.meteor/packages/iron_router/.1.1.2.rl6539.wj6hk++os+web.browser+web.cordova/npm/node_modules/body-parser/node_modules/raw-body/index.js:95:12)
W20181213-20:30:49.602(-5)? (STDERR)     at read (/Users/wanglian/.meteor/packages/iron_router/.1.1.2.rl6539.wj6hk++os+web.browser+web.cordova/npm/node_modules/body-parser/lib/read.js:64:3)
W20181213-20:30:49.602(-5)? (STDERR)     at ctor.urlencodedParser (/Users/wanglian/.meteor/packages/iron_router/.1.1.2.rl6539.wj6hk++os+web.browser+web.cordova/npm/node_modules/body-parser/lib/types/urlencoded.js:104:5)
W20181213-20:30:49.603(-5)? (STDERR)     at packages/iron_router.js:886:36
W20181213-20:30:49.603(-5)? (STDERR)     at Meteor.EnvironmentVariable.EVp.withValue (packages/meteor.js:1304:12)
W20181213-20:30:49.603(-5)? (STDERR)     at ctor.hookWithOptions (packages/iron_router.js:885:27)
W20181213-20:30:49.603(-5)? (STDERR)     at boundNext (packages/iron_middleware-stack.js:408:31)
W20181213-20:30:49.603(-5)? (STDERR)     at runWithEnvironment (packages/meteor.js:1356:24)
W20181213-20:30:49.604(-5)? (STDERR)     at packages/meteor.js:1369:14
W20181213-20:30:49.604(-5)? (STDERR)     at ctor.jsonParser (/Users/wanglian/.meteor/packages/iron_router/.1.1.2.rl6539.wj6hk++os+web.browser+web.cordova/npm/node_modules/body-parser/lib/types/json.js:103:37)
W20181213-20:30:49.604(-5)? (STDERR)     at packages/iron_router.js:886:36
W20181213-20:30:49.604(-5)? (STDERR)     at Meteor.EnvironmentVariable.EVp.withValue (packages/meteor.js:1304:12)
W20181213-20:30:49.604(-5)? (STDERR)     at ctor.hookWithOptions (packages/iron_router.js:885:27)
W20181213-20:30:49.604(-5)? (STDERR)     at boundNext (packages/iron_middleware-stack.js:408:31)
```
讨论：https://github.com/iron-meteor/iron-router/issues/710
解决
```
Router.configureBodyParsers = function() {
  Router.onBeforeAction(Iron.Router.bodyParser.urlencoded({
    extended: true,
    limit: '50mb'
  }));
};
```