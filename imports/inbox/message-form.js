import './message-form.html';
import './message-form.css';

import SimpleSchema from 'simpl-schema';
import autosize from 'autosize';
import Swal from 'sweetalert2';

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
    let data = Template.currentData().thread;
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
    Session.set(`message-draft-${this.data.thread._id}`, textarea.val());
  }
});

Template.MessageForm.helpers({
  formCollection() {
    return Messages;
  },
  formSchema() {
    return MESSAGE_SCHEMA;
  },
  parentMessage() {
    let m = Session.get(`message-draft-parent-${this.thread._id}`);
    return m && Messages._transform(m);
  },
  pendingFiles() {
    return Files.find({"meta.relations": {$elemMatch: {threadId: this.thread._id, type: 'file', messageId: null}}}, {sort: {"meta.relations.createdAt": -1}});
  }
});

Template.MessageForm.events({
  "keyup form textarea"(e, t) {
    // ctrl + enter submit
    if (e.ctrlKey && e.which === 13) {
      t.$("form").submit();
    }
  },
  "click #btn-remove-quote"(e, t) {
    e.preventDefault();
    Session.set(`message-draft-parent-${this.threadId}`);
  },
  "click #btn-file"(e, t) {
    e.preventDefault();
    $('#file').click();
  },
  "change #file"(e, t) {
    Modal.show('FileUploadModal', {
      thread: this.thread,
      file:   e.target.files[0]
    }, {
      backdrop: 'static'
    });
    $(e.target).val(""); // reset file input
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
      thread: this.thread,
      file:   e.target.files[0]
    }, {
      backdrop: 'static'
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
      let parentMessage = Session.get(`message-draft-parent-${threadId}`);
      let parentMessageId = parentMessage && parentMessage._id;
      Meteor.call('sendMessage', threadId, {
        content:  insertDoc.content,
        internal: insertDoc.internal,
        parentId: parentMessageId,
        fileIds
      }, (err, res) => {
        if (err) {
          console.log(err);
        } else {
          console.log(res);
          Session.set(`message-draft-parent-${threadId}`);
          autosize($("form textarea"));
          // $("form textarea").focus();
          // fire event
          $(document).trigger("message.sent", {id: res});
        }
      });
      this.done();
    }
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
  contentPlaceholder() {
    return `${I18n.t('Write something')} ...`;
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
