import './email.html';

const DOMPurify = require('dompurify');
Template.EmailContent.onRendered(function() {
  this.autorun(() => {
    let data = Template.currentData();

    if (data && data.content) {
      let frame = this.$('iframe');
      let content = DOMPurify.sanitize(data.content) + '<style>body {font-family: "Helvetica Neue", Helvetica, Arial, sans-serif; margin: 0px; overflow-y: hidden; font-size: 14px; font-weight: 400; color: #333;} img {max-width: 100% !important; height: auto !important; cursor: zoom-in;} a img {cursor: pointer;} em {background: yellow;}</style>';
      let frameContent = frame[0].contentWindow.document;
      frameContent.open();
      frameContent.write(content);
      frameContent.close();
      // new Viewer(frameContent.body, _.extend(viewerjsOptions, {
      //   title: false,
      //   filter(img) { if (!$(img).closest('a').length) { return true; }}
      // }));
      _.each(frame.contents().find('a'), (aTag) => { aTag.target = '_blank'; });
      this.$(".spinner").remove();
      frame.css("height", frameContent.body.offsetHeight + 'px');
      // Chrome
      frame.load(() => {
        frame.css("height", frameContent.body.offsetHeight + 'px');
      });
    }
  });
});
