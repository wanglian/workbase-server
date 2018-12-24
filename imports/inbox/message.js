import './message.html';
import './message.css';

import ClipboardJS from 'clipboard';
import moment from 'moment';

import '@fancyapps/fancybox';
import '@fancyapps/fancybox/dist/jquery.fancybox.css';

// copy到剪贴板
let clipboard = (text, event) => {
  let cb = new ClipboardJS('.null', {
    text: () => text
  });

  cb.on('success', function(e) {
    // console.log(e);
    cb.off('error');
    cb.off('success');
  });

  cb.on('error', function(e) {
    // console.log(e);
    cb.off('error');
    cb.off('success');
  });

  cb.onClick(event);
};

Template.Message.onRendered(function() {
  $('.message [data-toggle="tooltip"]').tooltip({delay: 1000});
  $('.message-content a[data-fancybox]').fancybox({
    // Options will go here
  });
});

Template.Message.helpers({
  showInternal() {
    return this.internal && this.thread().hasExternalMembers();
  },
  isNew() {
    return this.createdAt > moment().subtract(10, 'seconds').toDate();
  },
  userName() {
    let user = this.user();
    if (!user) return;

    switch(this.userType) {
    case 'Users':
      return user.name();
    default:
      if (this.email) return this.email.from;
      return user.address();
    }
  }
});

Template.Message.events({
  "click a[data-fancybox=image]"(e, t) {
    // e.preventDefault();
  },
  "mouseenter .message .message-header"(e, t) {
    e.preventDefault();
    $(e.target).find(".message-actions").removeClass('hide');
  },
  "mouseleave .message .message-header"(e, t) {
    e.preventDefault();
    $(e.target).find(".message-actions").addClass('hide');
  },
  "click .message-header"(e, t) {
    e.preventDefault();
    // shift + click 折叠/展开全部
    if (e.shiftKey) {
      let m = $(e.target).closest(".message");
      if ($(m).hasClass("fold")) {
        $(".message").removeClass("fold");
      } else {
        $(".message").addClass("fold");
      }
    } else {
      $(e.target).closest(".message").toggleClass("fold");
    }
  }
});

Template.MessageActions.onRendered(function() {
  $('.message-actions [data-toggle="tooltip"]').tooltip({container: 'body', trigger: 'hover', delay: 1000});
});

Template.MessageActions.events({
  "click .btn-copy"(e, t) {
    e.stopPropagation();
    clipboard(t.data.content, e);
    $(e.target).closest('.btn-copy').attr('data-original-title', I18n.t('Copied')).tooltip('fixTitle').tooltip('show');
  }
});
