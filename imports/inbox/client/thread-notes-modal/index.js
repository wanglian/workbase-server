import './view.html';
import './style.css';

import SimpleSchema from 'simpl-schema';

Template.ThreadNotesModal.helpers({
  notes() {
    // TODO tricky!
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
  }
});

AutoForm.hooks({
  "thread-content-form": {
    onSubmit: function(insertDoc, updateDoc, currentDoc) {
      this.event.preventDefault();

      saveThreadContent.call({
        threadId: currentDoc._id,
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