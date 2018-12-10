import './send-email-modal.html';

import SimpleSchema from 'simpl-schema';
import autosize from 'autosize';

Template.SendEmailModal.onRendered(function() {
  $('input[name=to]').selectize(emailSelectizeConfig);
});

Template.SendEmailModal.helpers({
  formCollection() {
    return Threads;
  },
  formSchema() {
    return new SimpleSchema({
      to: {
        type: String,
        autoform: {
          type: 'text',
          label: I18n.t("To"),
          placeholder: I18n.t("Recipients")
        }
      },
      subject: {
        type: String,
        autoform: {
          type: 'text',
          label: false,
          placeholder: I18n.t("Subject")
        }
      },
      content: {
        type: String,
        autoform: {
          type: 'textarea',
          label: false,
          afFieldInput: {
            type: "textarea",
            rows: 8
          }
        }
      }
    });
  }
});

AutoForm.hooks({
  "send-email-form": {
    onSubmit: function(insertDoc, updateDoc, currentDoc) {
      this.event.preventDefault();

      Meteor.call('sendEmail', insertDoc.to, insertDoc.subject, insertDoc.content, (err, res) => {
        if (err) {
          console.log(err);
        } else {
          console.log(res);
        }
        Modal.hide('SendEmailModal');
        this.done();
      });
    }
  }
});

const REGEX_EMAIL = '([a-z0-9!#$%&\'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&\'*+/=?^_`{|}~-]+)*@' +
                    '(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)';
const emailSelectizeConfig = {
  persist: false,
  maxItems: null,
  valueField: 'email',
  labelField: 'name',
  searchField: ['name', 'email'],
  render: {
    item: function(item, escape) {
      if (item.name) {
        return '<div>' +
          '<span class="name">' + escape(item.name) + '</span> ' +
          '<span class="email">&lt;' + escape(item.email) + '&gt;</span>' +
        '</div>';
      } else {
        return '<div><span class="email">' + escape(item.email) + '</span></div>';
      }
    },
    option: function(item, escape) {
      var label = item.name || item.email;
      var caption = item.name ? item.email : null;
      return '<div>' +
        '<span class="selectize-label">' + escape(label) + '</span>' +
        (caption ? ' <span class="selectize-caption">&lt;' + escape(caption) + '&gt;</span>' : '') +
      '</div>';
    }
  },
  createFilter: function(input) {
    var match, regex;

    // email@address.com
    regex = new RegExp('^' + REGEX_EMAIL + '$', 'i');
    match = input.match(regex);
    if (match) return !this.options.hasOwnProperty(match[0]);

    // name <email@address.com>
    regex = new RegExp('^([^<]*)\<' + REGEX_EMAIL + '\>$', 'i');
    match = input.match(regex);
    if (match) return !this.options.hasOwnProperty(match[2]);

    return false;
  },
  create: function(input) {
    var match = input.match(new RegExp('^([^<]*)\<' + REGEX_EMAIL + '\>$', 'i'));
    if (match) {
      return {
        email : match[2],
        name  : $.trim(match[1])
      };
    } else if ((new RegExp('^' + REGEX_EMAIL + '$', 'i')).test(input)) {
      // let def = $.Deferred();
      // bootbox.prompt({
      //   size: "small",
      //   title: "Name for " + input,
      //   callback: def.resolve
      // });
      // return def.promise().then(function(result) {
      //   console.log(result);
      //   return {name: result, email: input};
      // });
      let result = prompt("Please enter the name for" + input);
      return {name: result, email: input};
    } else {
      alert('Invalid email address.');
      return false;
    }
  },
  load: function(query, callback) {
    if (!query.length) return callback();

    Meteor.call('queryContacts', query, (err, res) => {
      if (err) {
        console.log(err);
        callback();
      } else {
        console.log(res);
        callback(res);
      }
    });
  }
};