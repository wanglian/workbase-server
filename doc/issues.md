
- i18n问题：产品环境浏览器正常，APP上week不能显示中文

发现问题是：Chrome正常，Safari不正常。因为iOS APP用的是Safari。

- Markdown链接在新窗口打开

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

- APP Hot Code Push问题

如果APP统一上架应用商店，但实际上需要连接各自的Server，并且从各自的Server上获取新代码。

- 产品环境下用户切换时右侧内容不变

只有一种情况：从会话视图切换到本人（非会话视图，如果会话视图存在则没问题）
开发环境没问题

- ViewerJS显示文件名问题

实现保存的文件名与原文件名是不一致的，而ViewerJS显示的是路径中的文件名。
解决方案是修改模板

```
<div id = "documentName" style="display:none;"></div>
```

- 外发inline图片文件名问题

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

- 旋转数组
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

- 转发gmail邮件过来报错
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