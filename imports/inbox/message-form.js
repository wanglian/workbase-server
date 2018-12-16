import './message-form.html';
import './message-form.css';

import SimpleSchema from 'simpl-schema';
import autosize from 'autosize';

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
    return new SimpleSchema({
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
  }
});

Template.MessageForm.events({
  "keyup form textarea"(e, t) {
    // ctrl + enter submit
    if (e.ctrlKey && e.which === 13) {
      t.$("form").submit();
    }
  },
  "click #btn-load-image"(e, t) {
    e.preventDefault();
    $('#image-file').click();
  },
  "change #image-file"(e, t) {
    console.log("image selected");
    let internal = false;
    if ($("input[name=internal]")[0]) {
      internal = $("input[name=internal]")[0].checked;
    }
    Modal.show('ImageMessageModal', {
      thread:   t.data,
      file:     e.target.files[0],
      internal
    }, {
      backdrop: 'static',
      keyboard: false
    });
  }
});

AutoForm.hooks({
  "message-form": {
    onSubmit: function(insertDoc, updateDoc, currentDoc) {
      this.event.preventDefault();

      let threadId = this.formAttributes.threadId;
      Meteor.call('sendMessage', threadId, insertDoc.content, insertDoc.internal, (err, res) => {
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

Template.ImageMessageModal.onCreated(function () {
  this.currentUpload = new ReactiveVar(false);
});

import loadImage from "blueimp-load-image";
Template.ImageMessageModal.onRendered(function() {
  loadImage(this.data.file, (img) => {
    $("#image-preview").html(img);
    $("#image-preview img").addClass("img-responsive center-block");
  }, {
    maxWidth: "570",
    maxHeight: "400"
  });
});

Template.ImageMessageModal.helpers({
  currentUpload() {
    return Template.instance().currentUpload.get();
  }
});

Template.ImageMessageModal.events({
  "click #btn-send-image"(e, t) {
    e.preventDefault();

    const upload = Images.insert({
      file: t.data.file,
      streams: 'dynamic',
      chunkSize: 'dynamic'
    }, false);

    upload.on('start', function () {
      t.currentUpload.set(this);
    });

    upload.on('end', function (error, fileObj) {
      if (error) {
        alert('Error during upload: ' + error);
      } else {
        // alert('File "' + fileObj.name + '" successfully uploaded');
        Meteor.call('sendMessage', t.data.thread._id, fileObj._id, t.data.internal, 'image', (err, res) => {
          Modal.hide('ImageMessageModal');
        });
      }
      t.currentUpload.set(false);
    });

    upload.start();
  }
});
