import './style.css';
import './email-input/email-input.js';

import SimpleSchema from 'simpl-schema';

SimpleSchema.extendOptions(['autoform']);

// https://emailregex.com/
// /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/ // W3C input[type=email]
const REGEX_EMAIL = '[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+[\.]+[a-zA-Z0-9-]+'; // 改进：必须有.
// const REGEX_EMAIL = '([a-z0-9!#$%&\'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&\'*+/=?^_`{|}~-]+)*@' +
//                     '(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)';

// - method: Meteor method name to load data
// - params:
selectizeEmail = (method, params) => {
  return {
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
      },
      option_create: function(data, escape) {
        return '<div class="create">' + I18n.t("添加") + ' <strong>' + escape(data.input) + '</strong>&hellip;</div>';
      }
    },
    createFilter: function(input) {
      var match, regex;

      // email@address.com
      regex = new RegExp('^' + REGEX_EMAIL + '$');
      match = input.match(regex);
      if (match) return !this.options.hasOwnProperty(match[0]);

      // name <email@address.com>
      regex = new RegExp('^([^<]*)\<' + REGEX_EMAIL + '\>$');
      match = input.match(regex);
      if (match) return !this.options.hasOwnProperty(match[2]);

      return false;
    },
    create: true,
    // create: function(input) {
    //   var match = input.match(new RegExp('^([^<]*)\<' + REGEX_EMAIL + '\>$', 'i'));
    //   if (match) {
    //     return {
    //       email : match[2],
    //       name  : $.trim(match[1])
    //     };
    //   } else if ((new RegExp('^' + REGEX_EMAIL + '$', 'i')).test(input)) {
    //     // let def = $.Deferred();
    //     // bootbox.prompt({
    //     //   size: "small",
    //     //   title: "Name for " + input,
    //     //   callback: def.resolve
    //     // });
    //     // return def.promise().then(function(result) {
    //     //   console.log(result);
    //     //   return {name: result, email: input};
    //     // });
    //     let result = prompt("Please enter the name for" + input);
    //     return {name: result, email: input};
    //   } else {
    //     alert('Invalid email address.');
    //     return false;
    //   }
    // },
    load: function(query, callback) {
      if (!query.length) return callback();

      Meteor.call(method, query, params, (err, res) => {
        if (err) {
          console.log(err);
          callback();
        } else {
          // console.log(res);
          callback(res);
        }
      });
    }
  };
};
