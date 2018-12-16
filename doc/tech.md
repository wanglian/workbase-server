# 技术方案

## 图片

工具
- [Meteor Files](https://github.com/VeliovGroup/Meteor-Files/wiki)
- [JavaScript Load Image](https://github.com/blueimp/JavaScript-Load-Image)
- [fancybox](https://github.com/fancyapps/fancybox)

方案
- 使用Metor Files管理
- Browser端使用JavaScript Load Image加载预览
- 图片预览样式，使用bootstrap .image-thumbnail，加上自定义高度和宽度限制
- ?图片编辑：剪切
- 图片查看，使用fancybox。可支持视频，等各种内容

排除方案
- https://github.com/lokesh/lightbox2 图片查看
- https://github.com/dimsemenov/Magnific-Popup 图片查看
