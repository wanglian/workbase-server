# Channel

频道的标识是Email，是一种特殊的用户。
```
Channel extends User {
  "profile.type": "Channels"
}
```

Thread
- scope="protected"

ThreadUser
- 两个：外部联系人，频道
- read 回复外部
- unread 外部新消息

Message
- email.from 以用户名 + 频道email发出

成员操作。可以看作是把话题的成员抽到频道层面。
- 添加成员
- 删除成员

