# WeWork

## Run

```
meteor npm install
meteor
```
access from http://localhost:3000

## Run Tests

```
TEST_WATCH=1 meteor test --driver-package meteortesting:mocha --settings settings.json // unit tests
TEST_WATCH=1 meteor test --full-app --driver-package meteortesting:mocha --settings settings.json // integration tests
```

## Docker

Local
```
./build
```

Server
```
docker pull wanglian/wework:latest
docker run -d \
  -e ROOT_URL=<> \
  -e MONGO_URL=<mongodb://url> \
  -e MONGO_OPLOG_URL=<mongodb://oplog_url> \
  -e HTTP_FORWARDED_COUNT=1 \
  -e CLUSTER_WORKERS_COUNT=auto \
  -e METEOR_SETTINGS="$(cat settings.json)" \
  -p 80:3000 \
  --link <mongodb> \
  --name <docker instance name> \
  --restart always \
  wanglian/wework:latest
```

## App

```
meteor build ../workbase-app --server=https://www.weaworking.com
// 然后打开 WorkBase.xcworkspace，从XCode发布
```

## Develop

References
- [Meteor](https://docs.meteor.com/)
- [bootstrap](https://getbootstrap.com/docs/3.3/javascript/)
- [AdminLTE](https://adminlte.io/themes/AdminLTE/index.html)
- [Blaze](http://blazejs.org/api/templates.html)
- [mailgun](https://documentation.mailgun.com/en/latest/api-routes.html)
- [mailgun-js](https://github.com/bojand/mailgun-js)
- [autoform](https://github.com/aldeed/meteor-autoform)
- [iron-router](http://iron-meteor.github.io/iron-router/)
- [underscore](https://underscorejs.org)
- [momentjs](https://momentjs.com/docs/)
- [chartjs](https://www.chartjs.org/)
- [Meteor Files](https://github.com/VeliovGroup/Meteor-Files/wiki)
- [JavaScript Reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference)
- [ES6 入门](http://es6.ruanyifeng.com)
- [Meteor Template helpers](https://github.com/VeliovGroup/Meteor-Template-helpers/)
- [i18next](https://www.i18next.com/)
