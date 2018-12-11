import './setup.html';

import SimpleSchema from 'simpl-schema';

Template.Setup.helpers({
  formCollection() {
    return Instance;
  },
  formSchema() {
    return new SimpleSchema({
      name: {
        type: String,
        max: 50,
        autoform: {
          type: 'text',
          label: I18n.t('User Name'),
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
      password: {
        type: String,
        max: 50,
        autoform: {
          type: 'password',
          label: I18n.t("Password")
        }
      }
    });
  }
});

AutoForm.hooks({
  "setup-form": {
    onSubmit: function(insertDoc, updateDoc, currentDoc) {
      this.event.preventDefault();

      Meteor.call('setup', insertDoc.name, insertDoc.email, insertDoc.password, (err, res) => {
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
