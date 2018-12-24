# 技术方案

## Mailgun

Router: store and notify

## 图片

工具
- [Meteor Files](https://github.com/VeliovGroup/Meteor-Files/wiki)
- [JavaScript Load Image](https://github.com/blueimp/JavaScript-Load-Image)
- [fancybox](https://github.com/fancyapps/fancybox)

方案
- 使用Metor Files管理
- Browser端使用JavaScript Load Image加载预览
- 图片预览样式，使用bootstrap .image-thumbnail，加上自定义高度和宽度限制
- ?图片编辑：剪切，旋转
- 图片查看，使用fancybox。可支持视频，等各种内容
- 图片处理 thumbnail: 800w

调研方案
- https://github.com/lokesh/lightbox2 图片查看
- https://github.com/dimsemenov/Magnific-Popup 图片查看
- https://github.com/enyo/dropzone

## 文件

- 文件大小限制：在Files中设置，然后取决于Server
- 外发邮件：Mailgun限制在25M，我们将附件限制在20M
- 先保存，再发送。也就是文件要存草稿
- 双向保存关系：Message中保存在fileIds, inlineFileIds；Files中保存引用：meta.relations: {threadId, messageId, userType, userId, type, createdAt}
- 两种文件：附件file，内嵌图片inline。Message以字段区分fileIds/inlineFileIds，File以type区分：file/inline
- Message中的关系在创建时提供（先保存文件），Message保存后回填File中的引用关系

```
1 upload file: meta.relations[{threadId, userType, userId, type, createdAt}]
2 save message: fileIds, inlineFileIds
3 update file: meta.relations[{messageId}]
```

文件查看，使用fancybox
- 图片
- 视频
- 音频 inline
- Text iframe
- pdf|odf iframe + ViewerJS
- word|excel|ppt iframe + 微软online office

ViewerJS
https://github.com/kogmbh/ViewerJS
使用的是
- https://github.com/mozilla/pdf.js
- https://webodf.org/

## 邮箱 noreply

无需回复的邮箱

- 邮件地址自动识别
```
email.match(/noreply|no_reply|no-reply|do-not-reply|do_not_reply/i)
```
- 查询联系人时排除
- 外发邮件时排除
- 不显示回复框：当只有noreply的参与者时

## Thread扩展方案

### 菜单

- 图标弹出？
- 菜单按钮

```
{{#if showActions}}
  <span class="btn-group inbox-header-icon pull-right">
    <a href="#" class="dropdown-toggle text-muted" data-toggle="dropdown" aria-expanded="false">
      <i class="fa fa-ellipsis-h"></i>
    </a>
    {{> Template.dynamic template=threadActionsTemplate}}
  </span>
{{/if}}

Template.ThreadHeader.helpers({
  showActions() {
    return eval(`Template.${this.category}ThreadActions`);
  },
  threadActionsTemplate() {
    return `${this.category}ThreadActions`;
  }
});

<template name="RosterThreadActions">
  <ul class="dropdown-menu" role="menu">
    <li><a href="#" id="btn-show-rosters"><i class="fa fa-list-ul"></i> {{_ "User List"}}</a></li>
  </ul>
</template>

Template.RosterThreadActions.events({
  "click #btn-show-rosters"(e, t) {
    e.preventDefault();
    Modal.show('RosterListModal', null, {
      backdrop: 'static',
      keyboard: false
    });
  }
});
```
