# mailgun-js

https://github.com/bojand/mailgun-js

## 发送内嵌图片(inline)

https://github.com/bojand/mailgun-js/issues/161

```
{
  from:
  to:
  subject:
  html: `<img src="cd:${image.name}"/>`,
  inline: image.path // 这里image是Meteor Files对象
}
```