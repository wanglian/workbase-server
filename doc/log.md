# 开发日志

## 1-1

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
