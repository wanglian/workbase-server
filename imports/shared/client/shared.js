import './shared.html';

import Swal from 'sweetalert2';

Template.Shared.onRendered(function() {
  // 滚动页面触发
  $('#inbox-left').on('scroll', (e) => {
    let shared = ThreadUsers.findOne({category: 'Shared', userType: 'Users', userId: Meteor.userId()});
    if (shared && !shared.read) {
      Meteor.call("markRead", shared.threadId, (err, res) => {
        if (err) {
          console.log(err);
        }
      });
    }
  });
});

Template.Shared.helpers({
  sharedThread() {
    return Threads.findOne({category: 'Shared'});
  },
  messages() {
    let thread = Threads.findOne({category: 'Shared'});
    return Messages.find({threadId: thread._id, parentId: {$exists: false}}, {sort: {createdAt: -1}});
  },
  comments() {
    return Messages.find({parentId: this._id}, {sort: {createdAt: -1}});
  }
});

Template.Shared.events({
  "click .btn-comment"(e, t) {
    e.preventDefault();

    Swal({
      input: 'textarea',
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton: true,
      confirmButtonText: I18n.t("Send"),
      cancelButtonText: I18n.t("Discard"),
      showLoaderOnConfirm: true,
      allowOutsideClick: false
    }).then((result) => {
      if (result.value) {
        Meteor.call("addComment", this._id, result.value);
      }
    })
  }
});

Template.SharedMenuItem.helpers({
  shared() {
    return ThreadUsers.findOne({category: 'Shared', userType: 'Users', userId: Meteor.userId()});
  }
});

Template.SharedMenu.events({
  "click #btn-share"(e, t) {
    e.preventDefault();
    $('#shared-form').toggleClass("hide");
    $('#shared-form textarea').focus();
  }
});
