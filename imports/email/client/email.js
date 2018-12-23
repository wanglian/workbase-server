import './email.html';

Template.EmailListItem.helpers({
  icon() {
    let c = ThreadCategories.get(this.category)
    return this.read ? c.icon : c.iconUnread;
  }
});

const DOMPurify = require('dompurify');
Template.EmailContent.onRendered(function() {
  this.autorun(() => {
    let data = Template.currentData();

    if (data && data.content) {
      let template = Template.instance();
      let frame = template.$('iframe');
      let content = DOMPurify.sanitize(data.content) + '<style>body {font-family: "Helvetica Neue", Helvetica, Arial, sans-serif; margin: 0px; overflow-y: hidden; font-size: 14px; font-weight: 400; color: #333;} img {max-width: 100% !important; height: auto !important; cursor: zoom-in;} a img {cursor: pointer;} em {background: yellow;}</style>';
      let frameContent = frame.get(0).contentWindow.document;
      frameContent.open();
      frameContent.write(content);
      frameContent.close();
      // new Viewer(frameContent.body, _.extend(viewerjsOptions, {
      //   title: false,
      //   filter(img) { if (!$(img).closest('a').length) { return true; }}
      // }));
      _.each(frame.contents().find('a'), (aTag) => { aTag.target = '_blank'; });
      template.$(".spinner").remove();
      // $(template.parent().find('.relation-content')).removeClass('hide');
      frame.css("height", frameContent.body.offsetHeight + 'px');
      // $(template.parent().find('.relation-content')).addClass('hide');
      // Chrome
      frame.load(() => {
        // $(template.parent().find('.relation-content')).removeClass('hide');
        frame.css("height", frameContent.body.offsetHeight + 'px');
        // $(template.parent().find('.relation-content')).addClass('hide');
      });
    }
  });
});
