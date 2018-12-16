# Javascript Load Image

https://github.com/blueimp/JavaScript-Load-Image


## 基本用法

```
import loadImage from "blueimp-load-image";

loadImage(file, (img) => {
  $("#image-preview").html(img);
  $("#image-preview img").addClass("img-responsive center-block");
}, {
  maxWidth: "570",
  maxHeight: "400"
});
```