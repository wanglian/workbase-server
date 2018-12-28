# 开发进展

## 12-28

- 使用lodash替代underscore
- 用户设置加上日志
- fix search: 使用MongoDBEngine
- fix app里打开链接

## 12-27

- Thread扩展details配置项 About/Members
- 话题内搜索消息
- 按主题搜索话题

## 12-26

- 添加Thread扩展配置details，控制是否显示Details栏。（TODO：控制Details显示区块）
- “我的帐号”做成Thread扩展category=Account：展示登录成功/失败/退出日志，将个人设置改为Modal，做进“我的帐号”。登录订阅我的帐号信息(Thread)
- fix onLogin会在每次连接触发，太多。改成用户主动密码登录时才记录
- fix Channel的话题列表: category=Email。Thread类型增多，这里有点不好理解了，规则是频道里只有Email话题。
- 报表做成Thread扩展category=Charts
- fix i18n: 集中各模块设置
- 统一话题下文件查看（gallery）
- 外发邮件带上签名

## 12-25

- 频道管理（添加/修改/成员/日志）,保留原菜单形式
- fix 用户修改profile不记录到用户管理日志
- 修改 Users.profile.channel -> Users.profile.type: Users/Channels
- fix 修改模板skin显示不稳定的情况（原因是没有等到user数据加载完成）
- selectize i18n: create/option_create
- gallery查看图片
- 统一使用Router Controller，小屏幕下自动关闭左边菜单栏
- fix 重复创建私聊

## 12-24

- fix 消息列表未读标记（z-index）
- 改进APP消息推送：图片消息，国际化
- 添加DB索引
- 完善skin设置，fix设置语言生效
- Thread扩展方案：菜单。实现用户管理：以消息形式记录日志（添加/修改用户）

## 12-23

- 个人设置：语言，模板，邮件签名
- 上传头像
- fix Hot Code Push
- 回复消息后增加flash效果：使用animate.css (ScrollReveal需要License)
- markdown内链接在新窗口打开(blank)

## 12-22

- 改进moment，时间显示国际化
- 连接状态栏国际化
- 按用户浏览器环境本地化
- 界面skin，默认blue。用户可设置（TODO）
- 消息输入框禁止手动调节（宽度）
- app加上camera支持 cordova-plugin-camera （不然打不开camera）
- app发布带上server参数，以支持Hot Code Push
- 改进登录，密码错误提示
- 小屏幕放大字体

## 12-21

- 增加iOS
- 购买Apple开发帐号 $135
- 购买logo https://www.logaster.com $72
- iOS消息推送，配置开发/发布环境的cert/key
- 提交到Apple Store，使用TestFlight开始测试

## 12-20

- 文件查看：pdf/video/audio/word/excel/ppt/text。使用fancybox
- 使用pdf|odf查看器 ViewerJS，隐藏查看器中的文件名
- 使用微软在线office查看文档
- 重构文件相关模板
- fix 邮件消息的发件人从email.from中显示，这对channel是必要的
- 分离文件存储策略：本地存储和S3。这样可以方便地扩展第三方存储，比如阿里云
- 研究AWS和阿里云的marketplace，考虑在云平台上直接销售
- 更新部署docker，支持GraphicsMagick
- 欢迎邮件：以管理员身份发出。管理员的欢迎邮件以产品经理身份发出（TODO）

## 12-19

- 查看消息文件中的图片
- 图片resize: thumbnail 800w
- 重构S3部分代码，分离出来
- fix 解析邮件内嵌图片处理 image -> inline
- 捕获文件上传处理异常。这个偶尔出现，但会使Server崩溃
- 显示文件类型图标
- 使用Meteor-Template-helpers简化模板代码
- fix 外发inline邮件图片文件名问题

## 12-18

- 消息附件：发送，草稿存储/删除，展现
- 整理逻辑，发送/接收分别区分消息附件和图片
- 外发邮件的附件处理

## 12-17

- mailgun路由配置为Store and notify，便于处理附件
- fix发送图片：cid设置为Meteor Files保存的文件名
- mailgun邮件解析：处理附件 async/await/promise
- 发消息表单，按钮放到右边
- 纯图片消息的summary处理
- 自定义邮件消息属性 v:MessageType=image 图片类型
- 使用sweetalert2（替换sweetalert）
- noreply: 自动识别，收件人和添加成员排除在外，外发邮件排除在外，判断是否显示回复框

## 12-16

- 内部消息标识：只在有外部联系人的情况下显示
- 图片上传显示spinner
- 使用fancybox查看图片
- 上传图片到S3
- Meteor Files文件路径使用绝对路径，因为docker部署找不到相对路径
- fix 重置图片上传input；上传时disable按钮
- 发送图文消息
- 重命名 Images -> Files，准备用作通用文件保存

## 12-15

- 时区方案：Server系统时区设置为企业总部所在，程序不用处理时区问题。限制是报表只能以Server时区统计
- fix chart: 设置y轴精度，不要出现小数点
- 发送图片：可预览，增加image消息类型，image消息类型展现，image消息以内嵌图片发邮件
- 异步发送邮件 Promise
- 写邮件完成后，重定向到邮件话题

## 12-14

- 解析邮件区分格式html/text：有bodyHtml为html，否则从bodyPlain取为text
- 用iframe显示html内容
- html内的链接在新窗口打开：target=_blank
- 进入话题页面或切换话题，默认焦点放在回复框，并且可以按ctrl+enter发送。（考虑到移动设备上的体验，消息发送后，或进入/切换话题，均不focus到回复框）
- 样式改进：列表选中border加深，光标在消息上时消息头部显示背景色及底边框；消息折叠情况下的优化处理
- Modal设置为静态模式，点击不会关闭
- 消息统计：日统计，分时统计

## 12-13

- fix动态布局：之前是整个页面重新渲染。
- fix布局相关页面：话题列表/用户列表/频道
- 话题列表分页
- 频道话题列表分页
- 消息分页
- fix草稿：保存不必判断是否为空，否则不能删除草稿
- 发送邮件带上h:In-Reply-To 为上一条消息的emailId
- fix解析邮件聚合：In-Reply-To + References
- fix接收邮件内容限制：设置为50M

## 12-12

- 话题管理者：话题创建者（外部联系人发起的邮件，外部联系人为创建者），或第一个内部用户
- 话题成员不能删除：创建者（或原始发起人）
- 浏览器TAB标题显示未读数
- LOGO设计 https://www.logaster.com
- fix read：发邮件时本人直接标记已读
- fix ipad浏览器布局显示问题：多加了clearfix

## 12-11

- 话题成员角色：创建者
- 添加/删除话题成员
- 只有Email类型的话题可能 添加/删除成员。Chat类型不可。
- 部署到EC2：t2.medium (mongo + app)
- 使用配置文件：company/domain/mailgun key
- 首次使用系统，设置管理员帐号：name/email/password
- 更新欢迎信：中文
- 纯文本邮件解析：之前加上<pre></pre>，导致显示在代码框里。去掉。
- 增强Thread类型扩展：title加上参数detail，Chat有这个需求：列表里显示用户姓名，消息界面显示“与xx的会话”
- 申请ssl证书 weaworking.com：在腾讯云免费申请。
- 配置ssl
- Base -> WorkBase
- 使用W形状logo
- 删除话题成员确认

## 12-10

- 发邮件表单：收件人自动提示
- 国际化处理 i18next
- channel未读：收到外部消息标记为未读
- channel已读：回复外部标记为已读
- channel未读数显示
- fix route：router plugin使用不对（弃用）
- fix draft：两种情况保存：退出话题页面，切换话题。切换时先保存再加载。
- 消息功能：复制消息
- 异步解析邮件 Promise
- 邮件解析异常处理：收件人不存在，捕获异常返回成功给mailgun

## 12-09

- setup页面
- 重构welcome邮件
- profile页面，功能未做

## 12-08

- 改进标记已读：进入话题延时两秒，停留在话题页面有新消息时需滚动页面
- fix chat：开启聊天时检查自己的ThreadUser，发消息时检查对方的ThreadUser
- 添加/删除channel members

## 12-07

- 内部通信录
- 私聊 Chat
- Thread类型扩展方案：ThreadUsers.params保存扩展字段，client端带到Threads.params。
- 布局扩展方案：增加menu
- 添加/修改用户
- 添加/修改Channel
- 管理菜单：创建channel/用户
- 设置管理员角色，可见管理菜单

## 12-06

- channel - 创建 User profile.channel=true
- channel - 建立关系 ChannelUser
- channel - 入口 sidebar
- channel - 发布 threads
- 内部消息：不对外部联系人发邮件
- Threads 增加字段 scope: private/protected/public
- Threads 增加字段 userType/userId，提供一种扩展可能，可根据userType设置scope
- sidebar 菜单active状态
- 重构动态布局

## 12-05

- landing page
- 回复
- 标记已读
- spinner / status(server连接状态)
- 草稿：因为动态布局的切换导致页面重新render，所以消息框内容会消失，因此使用草稿来解决这个问题。按话题保存在浏览器端。
- 按shift点消息区，折叠/展开所有消息
- 动态布局的响应应返回按钮
- 发邮件基本功能

## 12-04

- 解析邮件：多个to，cc
- 改进三栏布局模板
- Accordion效果

## 12-03

- 实现内容区三栏动态自适应布局
- 实现话题列表（一栏）
- 实现话题展现（二栏）
- 实现回复邮件Method：sendMessage(threadId, content)
- 实现接收解析邮件（一对一），回复邮件聚合
- 实现消息折叠开关：shift+click全部折叠
