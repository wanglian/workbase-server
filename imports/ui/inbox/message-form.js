import './message-form.html';
import './message-form.css';

import SimpleSchema from 'simpl-schema';
import autosize from 'autosize';

Template.MessageForm.onRendered(function() {
  autosize(this.$('textarea'));
});

Template.MessageForm.helpers({
  formCollection() {
    return Messages;
  },
  formSchema() {
    return new SimpleSchema({
      content: {
        type: String,
        autoform: {
          type: 'textarea',
          label: false,
        }
      }
    });
  }
});

AutoForm.hooks({
  "message-form": {
    onSubmit: function(insertDoc, updateDoc, currentDoc) {
      this.event.preventDefault();

      let threadId = this.formAttributes.threadId;
      Meteor.call('sendMessage', threadId, insertDoc.content, (err, res) => {
        if (err) {
          console.log(err);
        } else {
          console.log(res);
        }
      });
      this.done();
    }
  }
});
