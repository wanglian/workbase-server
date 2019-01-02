# 开发日志

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
