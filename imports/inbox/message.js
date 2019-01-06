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

Template.MessageContent.helpers({
  isNew() {
    return this.createdAt > moment().subtract(10, 'seconds').toDate();
  }
});

Template.MessageActions.onRendered(function() {
  $('.message-actions [data-toggle="tooltip"]').tooltip({container: 'body', trigger: 'hover', delay: 1000});
});

Template.MessageActions.events({
  "click .btn-reply"(e, t) {
    e.stopPropagation();
    Session.set(`message-draft-parent-${t.data.threadId}`, t.data);
    $("form#message-form textarea").focus();
  },
  "click .btn-forward"(e, t) {
    e.stopPropagation();
    Modal.show('MessageForwardModal', this, {
      backdrop: 'static'
    });
  },
  "click .btn-copy"(e, t) {
    e.stopPropagation();
    clipboard(t.data.content, e);
    $(e.target).closest('.btn-copy').attr('data-original-title', I18n.t('Copied')).tooltip('fixTitle').tooltip('show');
  }
});

Template.MessageForwardModal.onCreated(function() {
  this.sub = new ReactiveVar(false);
});

Template.MessageForwardModal.onRendered(function() {
  const sub = this.subscribe("threads");
  this.sub.set(sub);
});

Template.MessageForwardModal.helpers({
  threads() {
    return Threads.find({scope: 'private', _id: {$ne: this.threadId}}, {sort: {updatedAt: -1}});
  },
  ready() {
    let sub = Template.instance().sub.get();
    return sub && sub.ready();
  }
});

Template.MessageForwardModal.events({
  "click .btn-select-thread"(e, t) {
    e.preventDefault();
    Modal.show('MessageForwardPreviewModal', {
      thread: this,
      message: t.data
    }, {
      backdrop: 'static'
    });
  }
});

Template.MessageForwardPreviewModal.events({
  "click #btn-view-message"(e, t) {
    e.preventDefault();
    Modal.show('MessageModal', this.message, {
      backdrop: 'static'
    });
  },
  "click #btn-forward-message"(e, t) {
    e.preventDefault();
    let message = this.message;
    Meteor.call("sendMessage", this.thread._id, {
      contentType:   message.contentType,
      content:       message.content,
      fileIds:       message.fileIds,
      inlineFileIds: message.inlineFileIds
    }, (err, res) => {
      $('#btn-close-MessageForwardPreviewModal').click();
      $('#btn-close-MessageForwardModal').click();
    });
  }
});
