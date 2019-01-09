import './view.html';

import SimpleSchema from 'simpl-schema';
import Swal from 'sweetalert2';

Template.Contact.helpers({
  formCollection() {
    return Messages;
  },
  formSchema() {
    return new SimpleSchema({
      name: {
        type: String,
        optional: true,
        max: 50,
        autoform: {
          type: 'text',
          label: I18n.t('Name'),
        }
      },
      email: {
        type: String,
        max: 50,
        regEx: SimpleSchema.RegEx.Email,
        autoform: {
          type: 'emailInput',
          label: 'Email'
        }
      },
      content: {
        type: String,
        max: 1000,
        autoform: {
          type: 'textarea',
          rows: 5,
          label: false,
        }
      }
    });
  }
});

AutoForm.hooks({
  "contact-form": {
    onSubmit: function(insertDoc, updateDoc, currentDoc) {
      this.event.preventDefault();

      Meteor.call('sendLiveChatMessage', insertDoc.email, insertDoc.name, insertDoc.content, (err, res) => {
        if (err) {
          console.log(err);
        } else {
          console.log(res);
          Swal({
            type: 'success',
            title: 'Thanks',
            text: "We'll reach you soon"
            // footer: '<a href>Why do I have this issue?</a>'
          })
        }
        this.done();
      });
    }
  }
});
