import './add-roster-modal.html';

import SimpleSchema from 'simpl-schema';

Template.AddRosterModal.onRendered(function() {

});

Template.AddRosterModal.helpers({
  formCollection() {
    return Users;
  },
  formSchema() {
    return new SimpleSchema({
      name: {
        type: String,
        autoform: {
          type: 'text',
          label: "Name"
        }
      },
      email: {
        type: String,
        autoform: {
          type: 'text',
          label: "Email"
        }
      },
      title: {
        type: String,
        optional: true,
        autoform: {
          type: 'text',
          label: 'Title',
        }
      }
    });
  }
});

AutoForm.hooks({
  "add-roster-form": {
    onSubmit: function(insertDoc, updateDoc, currentDoc) {
      this.event.preventDefault();

      Meteor.call('addMember', insertDoc.name, insertDoc.email, insertDoc.title, (err, res) => {
        if (err) {
          console.log(err);
        } else {
          console.log(res);
        }
        Modal.hide('AddRosterModal');
        this.done();
      });
    }
  }
});