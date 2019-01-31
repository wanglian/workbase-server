import './email.html';

const DOMPurify = require('dompurify');
const initIframe = (frame, content) => {
  content = DOMPurify.sanitize(content) + '<style>body {font-family: "Helvetica Neue", Helvetica, Arial, sans-serif; margin: 0px; overflow-y: hidden; font-size: 14px; font-weight: 400; color: #333;} img {max-width: 100% !important; height: auto !important; cursor: zoom-in;} a img {cursor: pointer;} em {background: yellow;}</style>';
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
};

Template.EmailContent.onRendered(function() {
  this.autorun(() => {
    let data = Template.currentData();
    let modal = data.modal;
    let message = data.message;

    if (message) {
      if (modal) {
        $(modal).on('shown.bs.modal', () => {
          initIframe(this.$('iframe'), message.content);
        });
      } else {
        initIframe(this.$('iframe'), message.content);
      }
    }
  });
});

Template.EmailInfo.events({
  "click .btn-resend-email"(e, t) {
    e.preventDefault();
    e.stopPropagation();
    Meteor.call("resendEmail", t.data._id);
  }
});
