import './setup.html';

import SimpleSchema from 'simpl-schema';

Template.Setup.helpers({
  formCollection() {
    return Instance;
  },
  formSchema() {
    return new SimpleSchema({
      domain: {
        type: String,
        autoform: {
          type: 'text',
          label: 'Domain',
        }
      },
      admin: {
        type: String,
        autoform: {
          type: 'text',
          label: "Admin account"
        }
      },
      password: {
        type: String,
        autoform: {
          type: 'password',
          label: 'Password'
        }
      }
    });
  },
  domain() {
    return $("input[name=domain").val();
  }
});

AutoForm.hooks({
  "setup-form": {
    onSubmit: function(insertDoc, updateDoc, currentDoc) {
      this.event.preventDefault();

      Meteor.call('setup', insertDoc.domain, insertDoc.admin, insertDoc.password, (err, res) => {
        if (err) {
          console.log(err);
        } else {
          console.log(res);
          Router.go('/login');
        }
        this.done();
      });
    }
  }
});
