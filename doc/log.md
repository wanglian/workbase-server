# 开发日志

## Meteor Email

https://docs.meteor.com/api/email.html

内置支持通过Mailgun发送，300/day限制（需要部署到meteor平台）
https://www.mailgun.com/blog/native-mailgun-integration-lets-meteor-apps-send-email

## 1-3

### 考虑WEB界面元素的APP Native化

https://github.com/apache/cordova-plugin-dialogs


## 1-2

### modal 全屏样式

- 采用absolute定位
- modal-body 滚动
```
.modal.full-screen
.modal.full-screen.no-footer
```

### 区域滚动样式

```
.scroll-box
```

### 界面的前后切换

cordova里用到 https://github.com/apache/cordova-plugin-wkwebview-engine
并且打开配置 AllowBackForwardNavigationGestures: true
这样可以左右滑动来切换界面。
但是仅仅这样体验不够好，期望能够做一些控制，做到Native的效果。
直接的想法是对history做控制。
这个插件研究一下 https://github.com/ReactTraining/history
重点在对history的控制。
结合IronRouter，有下面的方案
```
// 设置一个起点
Router.onBeforeAction(function() {
  if (_.isEmpty(this.params._id) && (!history.state || history.state.index != 1)) {
    console.log("start");
    history.replaceState({index: 0}, null, location.href);
    history.pushState({index: 1}, null, location.href);
  }
  this.next();
}, {
  only: ['inbox']
});
// 在起点时不再回退，并且打开菜单
window.onpopstate = function(event) {
  if (event.state && event.state.index === 0) {
    console.log("stop");
    history.go(1);
    $('body').addClass("sidebar-open");
  }
};
```
AdminLTE的sidebar不支持swipe。
综合考虑，想去掉AllowBackForwardNavigationGestures的功能，完全使用应用内导航。

参考
https://hammerjs.github.io/
https://stackoverflow.com/questions/16182993/how-to-prevent-a-browser-from-going-back-forward-in-history-when-scrolling-horiz
https://www.sitepoint.com/javascript-history-pushstate/

## 1-1

### Docker Repo

感觉推送到 docker hub上传比较慢，于是想直接推到Server上。
有两种方法
1 是直接上传文件
https://blog.giantswarm.io/moving-docker-container-images-around/
```
docker save ubuntu | gzip > ubuntu-golden.tar.gz
gzcat ubuntu-golden.tar.gz | docker load
```
2 是使用私有Repo，发现也很简单
https://docs.docker.com/registry/deploying/#run-a-local-registry
```
docker tag wanglian/wework:latest weaworking.com:5000/wework
docker push weaworking.com:5000/wework
docker pull localhost:5000/wework
```
上传遇到问题
Get https://weaworking.com:5000/v2/: http: server gave HTTP response to HTTPS client
解决：配置unsecure registries。Mac上直接从Docker设置里配置。
https://github.com/docker/distribution/issues/1874

### 分享功能

增加字段 ThreadUser.scope

历史数据处理
ThreadUsers.find({}).forEach((tu) => {
  let thread = tu.thread();
  if (thread) {
    ThreadUsers.update(tu._id, {$set: {scope: tu.thread().scope}});
  } else {
    ThreadUsers.remove(tu._id);
  }
});

增加ThreadUser以记录已读状态
标记已读：页面滚动，发消息
APP消息通知：区分分享和评论
