import './view.html';

import Swal from 'sweetalert2';

Template.FileEditNameLink.events({
  "click .btn-edit-file-name"(e, t) {
    e.preventDefault();
    Swal({
      title: I18n.t('message_action_edit_file_name'),
      input: 'text',
      inputValue: this.name,
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton: true,
      confirmButtonText: I18n.t("app_action_save"),
      cancelButtonText: I18n.t("app_action_discard"),
      showLoaderOnConfirm: true,
      allowOutsideClick: false
    }).then((result) => {
      if (result.value) {
        Meteor.call("files.updateFilename", this._id, result.value);
      }
    });
  }
});

Template.FileRemoveLink.events({
  "click .btn-remove-file"(e, t) {
    e.preventDefault();
    Swal({
      title: I18n.t("message_confirm_remove_file"),
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: I18n.t("app_action_confirm"),
      cancelButtonText: I18n.t("app_action_discard")
    }).then((result) => {
      if (result.value) {
        Meteor.call("files.remove", this._id);
      }
    });
  }
});

Template.FileUploadModal.onCreated(function() {
  this.currentUpload = new ReactiveVar(false);
});

Template.FileUploadModal.onRendered(function() {
  let data = this.data;
  let _this = this;
  const upload = Files.insert({
    file: data.file,
    streams: 'dynamic',
    chunkSize: 'dynamic',
    meta: {
      relations: [
        {
          threadId:  data.thread && data.thread._id,
          userType:  'Users',
          userId:    Meteor.userId(),
          type:      'file',
          createdAt: new Date()
        }
      ]
    }
  }, false);

  upload.on('start', function() {
    _this.currentUpload.set(this);
  });

  upload.on('end', function(error, fileObj) {
    if (error) {
      alert('Error during upload: ' + error);
    } else {
      Meteor.setTimeout(() => {
        Modal.hide('FileUploadModal');
        _this.currentUpload.set(false);
      }, 1000);
    }
  });

  upload.start();
});

Template.FileUploadModal.helpers({
  currentUpload() {
    return Template.instance().currentUpload.get();
  }
});

Template.ThreadDetailFiles.onRendered(function() {
  this.subscribe("thread.files", this.data._id);
  this.autorun(() => {
    let data = Template.currentData();
    this.subscribe("thread.files", data._id);
  });
});

Template.ThreadDetailFiles.helpers({
  count() {
    return Counts.get(`count-files-${this._id}`);
  },
  files() {
    return Files.find({"meta.relations": {$elemMatch: {threadId: this._id, messageId: {$exists: true}}}}, {sort: {createdAt: -1}}).cursor;
  }
});

Template.FileItem.helpers({
  user() {
    let meta = this.meta.relations[0];
    return meta.userType && Users.findOne(meta.userId);
  }
});
