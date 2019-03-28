import './view.html';
import './style.css';

import SimpleSchema from 'simpl-schema';
import autosize from 'autosize';

Template.ThreadNotesModal.onRendered(function() {
  //
});

Template.ThreadNotesModal.helpers({
  notes() {
    let thread = Threads.findOne(this._id);
    return thread.content;
  },
  formCollection() {
    return Threads;
  },
  formSchema() {
    return new SimpleSchema({
      content: {
        type: String,
        max: 10000,
        autoform: {
          type: 'textarea',
          label: false
        }
      }
    });
  }
});

Template.ThreadNotesModal.events({
  "click #btn-edit-content"(e, t) {
    e.preventDefault();
    t.$('.modal-content').addClass("edit");
  },
  "click #btn-save-content"(e, t) {
    e.preventDefault();
    t.$('#thread-content-form').submit();
  }
});

AutoForm.hooks({
  "thread-content-form": {
    onSubmit: function(insertDoc, updateDoc, currentDoc) {
      this.event.preventDefault();

      let threadId = this.formAttributes.threadId;
      saveThreadContent.call({
        threadId,
        content: insertDoc.content
      }, (err, res) => {
        if (err) {
          console.log(err);
        } else {
          console.log(res);
          $('.thread-content .modal-content').removeClass("edit");
        }
      });
      this.done();
    }
  }
});