import './shared.html';

import Swal from 'sweetalert2';

Template.Shared.helpers({
  sharedThread() {
    return Threads._transform({_id: Instance.get().sharedId});
  },
  messages() {
    return Messages.find({threadId: Instance.get().sharedId, parentId: {$exists: false}}, {sort: {createdAt: -1}});
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

Template.SharedTitle.events({
  "click #btn-share"(e, t) {
    e.preventDefault();
    $('#shared-form').toggleClass("hide");
  }
});
