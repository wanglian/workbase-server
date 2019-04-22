import './login.html';

import SimpleSchema from 'simpl-schema';
import Swal from 'sweetalert2';

Template.Login.helpers({
  formCollection() {
    return Instance;
  },
  formSchema() {
    return new SimpleSchema({
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
          label: I18n.t("users_password")
        }
      }
    });
  }
});

AutoForm.hooks({
  "login-form": {
    onSubmit: function(insertDoc, updateDoc, currentDoc) {
      this.event.preventDefault();

      Meteor.loginWithPassword(insertDoc.email, insertDoc.password, (err) => {
        if (err) {
          Swal({
            title: I18n.t("sign_in_failed"),
            type: "error"
          });
        } else {
          Meteor.call("updateLogin");
          Router.go('/inbox');
        }
        this.done();
      });
    }
  }
});
