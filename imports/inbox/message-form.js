import './message-form.html';
import './message-form.css';

import SimpleSchema from 'simpl-schema';
import autosize from 'autosize';
import Swal from 'sweetalert2'

const MESSAGE_SCHEMA = new SimpleSchema({
  internal: {
    type: Boolean,
    label: I18n.t('Internal'),
    optional: true,
    autoform: {
      type: "boolean-checkbox"
    }
  },
  content: {
    type: String,
    max: 10000,
    autoform: {
      type: 'textarea',
      rows: 3,
      label: false,
    }
  }
});

Template.MessageForm.onRendered(function() {
  let threadId;

  this.autorun(() => {
    let data = Template.currentData();
    if (data && data._id != threadId) {
      // save
      if (threadId) {
        let textarea = $('form textarea');
        let content = textarea && textarea.val();
        Session.set(`message-draft-${threadId}`, content);
      }
      // load
      threadId = data._id;
      let draft = Session.get(`message-draft-${threadId}`);
      $('form textarea').val(draft);
      // autosize & focus
      autosize($('form textarea'));
      // $('form textarea').focus();
    }
  });
});

Template.MessageForm.onDestroyed(function() {
  // save draft
  let textarea = $('#message-form textarea');
  if (textarea) {
    Session.set(`message-draft-${this.data._id}`, textarea.val());
  }
});

Template.MessageForm.helpers({
  formCollection() {
    return Messages;
  },
  formSchema() {
    return MESSAGE_SCHEMA;
  },
  pendingFiles() {
    return Files.find({"meta.relations": {$elemMatch: {threadId: this._id, messageId: null}}}, {sort: {"meta.relations.createdAt": -1}});
  }
});

Template.MessageForm.events({
  "keyup form textarea"(e, t) {
    // ctrl + enter submit
    if (e.ctrlKey && e.which === 13) {
      t.$("form").submit();
    }
  },
  "click #btn-file"(e, t) {
    e.preventDefault();
    $('#file').click();
  },
  "change #file"(e, t) {
    Modal.show('FileUploadModal', {
      thread: t.data,
      file:   e.target.files[0]
    }, {
      backdrop: 'static',
      keyboard: false
    });
    $(e.target).val(""); // reset file input
  },
  "click .btn-remove-file"(e, t) {
    e.preventDefault();
    Swal({
      title: I18n.t("confirm remove file"),
      type: 'warning',
      position: 'center-end',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: I18n.t("Confirm"),
      cancelButtonText: I18n.t("Discard")
    }).then((result) => {
      if (result.value) {
        Meteor.call("files.remove", this._id);
      }
    })
  },
  "click #btn-markdown"(e, t) {
    e.preventDefault();
    Swal({
      title: "Coming soon ^_^",
      type: "info",
      position: 'center-end'
    });
  },
  "click #btn-load-image"(e, t) {
    e.preventDefault();
    $('#image-file').click();
  },
  "change #image-file"(e, t) {
    console.log("image selected");
    Modal.show('ImageMessageModal', {
      thread: t.data,
      file:   e.target.files[0]
    }, {
      backdrop: 'static',
      keyboard: false
    });
    $(e.target).val(""); // reset file input
  }
});

AutoForm.hooks({
  "message-form": {
    onSubmit: function(insertDoc, updateDoc, currentDoc) {
      this.event.preventDefault();

      let threadId = this.formAttributes.threadId;
      let fileIds = Files.find({"meta.relations": {$elemMatch: {threadId, messageId: null, type: 'file'}}}).map(f => f._id);
      Meteor.call('sendMessage', threadId, {
        content: insertDoc.content,
        internal: insertDoc.internal,
        fileIds
      }, (err, res) => {
        if (err) {
          console.log(err);
        } else {
          console.log(res);
          autosize($("form textarea"));
          // $("form textarea").focus();
        }
      });
      this.done();
    }
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
          threadId:  data.thread._id,
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

Template.ImageMessageModal.onCreated(function() {
  this.currentUpload = new ReactiveVar(false);
});

import loadImage from "blueimp-load-image";
Template.ImageMessageModal.onRendered(function() {
  loadImage(this.data.file, (img) => {
    $("#image-preview").html(img);
    $("#image-preview img").addClass("img-responsive center-block");
  }, {
    maxWidth:  "570",
    maxHeight: "350"
  });
});

Template.ImageMessageModal.helpers({
  formCollection() {
    return Messages;
  },
  formSchema() {
    return MESSAGE_SCHEMA;
  },
  currentUpload() {
    return Template.instance().currentUpload.get();
  }
});

Template.ImageMessageModal.events({
  "click .add-comment a"(e, t) {
    e.preventDefault();

    $('.modal').toggleClass('image-only');
    $('.add-comment').toggleClass('hide');
    $("form textarea").focus();
  },
  "click #btn-send-image"(e, t) {
    e.preventDefault();

    $('#btn-send-image').attr("disabled", "disabled");
    const upload = Files.insert({
      file: t.data.file,
      streams: 'dynamic',
      chunkSize: 'dynamic',
      meta: {
        relations: [
          {
            threadId:  t.data.thread._id,
            userType:  'Users',
            userId:    Meteor.userId(),
            type:      'inline',
            createdAt: new Date()
          }
        ]
      }
    }, false);

    upload.on('start', function() {
      t.currentUpload.set(this);
    });

    upload.on('end', function(error, fileObj) {
      if (error) {
        alert('Error during upload: ' + error);
        $('#btn-send-image').attr("disabled", false);
      } else {
        // alert('File "' + fileObj.name + '" successfully uploaded');
        let content = t.$("textarea[name=content]").val();
        let internal = false;
        if (t.$("input[name=internal]")[0]) {
          internal = t.$("input[name=internal]")[0].checked;
        }
        Meteor.call('sendMessage', t.data.thread._id, {
          content,
          internal,
          inlineFileIds: [fileObj._id],
          contentType: 'image'
        }, (err, res) => {
          Modal.hide('ImageMessageModal');
        });
      }
      t.currentUpload.set(false);
    });

    upload.start();
  }
});
