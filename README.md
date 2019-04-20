# WorkBase

## Prerequisites

- [Git](http://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
- [Meteor](https://www.meteor.com/install)

## Run

```
git clone https://github.com/wanglian/workbase.git
cd workbase
meteor npm install
meteor npm start
```
access from http://localhost:3000

## Run Tests

```
meteor npm run test // unit tests
meteor npm run test-app // integration tests
meteor npm run test-e2e // acceptance tests
```

## Deploy with Docker

Build
```
./build-docker
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

## Develop References

- [Meteor](https://docs.meteor.com/)
- [bootstrap](https://getbootstrap.com/docs/3.3/javascript/)
- [FontAwesome](https://fontawesome.com/v4.7.0/icons/)
- [AdminLTE](https://adminlte.io/themes/AdminLTE/index.html)
- [AdminLTE 2.3](https://adminlte.io/themes/AdminLTE/documentation/index.html)
- [AdminLTE 2.4](https://adminlte.io/docs/2.4/js-layout)
- [Blaze](http://blazejs.org/api/templates.html)
- [mailgun](https://documentation.mailgun.com/en/latest/api-routes.html)
- [mailgun-js](https://github.com/bojand/mailgun-js)
- [autoform](https://github.com/aldeed/meteor-autoform)
- [iron-router](http://iron-meteor.github.io/iron-router/)
- [underscore](https://underscorejs.org)
- [lodash](https://lodash.com/docs/4.17.11)
- [momentjs](https://momentjs.com/docs/)
- [chartjs](https://www.chartjs.org/)
- [Meteor Files](https://github.com/VeliovGroup/Meteor-Files/wiki)
- [JavaScript Reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference)
- [ES6 入门](http://es6.ruanyifeng.com)
- [Meteor Template helpers](https://github.com/VeliovGroup/Meteor-Template-helpers/)
- [i18next](https://www.i18next.com/)
- [gm](http://aheckmann.github.io/gm/docs.html)
- [Meteor Easy Search](http://matteodem.github.io/meteor-easy-search/getting-started/)
- [w3schools CSS](https://www.w3schools.com/css/default.asp)
- [SubsManager](https://github.com/kadirahq/subs-manager)
