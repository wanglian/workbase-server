
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