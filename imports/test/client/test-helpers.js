// === Test Helpers for Client Blaze Tests ===
import { Template } from 'meteor/templating';
import { Blaze }    from 'meteor/blaze';
import { Tracker }  from 'meteor/tracker';
import { $ }        from 'meteor/jquery';

import chai   from 'chai';
import lodash from 'lodash';

import '../factories';

faker = require('faker');
sinon = require('sinon');

Template;
$;
faker;

expect = chai.expect;
_ = lodash;

Template.registerHelper('_', key => key);

const withDiv = function withDiv(callback) {
  const el = document.createElement('div');
  document.body.appendChild(el);
  try {
    callback(el);
  } finally {
    document.body.removeChild(el);
  }
};

withRenderedTemplate = function(template, data, callback) {
  withDiv((el) => {
    const ourTemplate = _.isString(template) ? Template[template] : template;
    Blaze.renderWithData(ourTemplate, data, el);
    Tracker.flush();
    callback(el);
  });
};