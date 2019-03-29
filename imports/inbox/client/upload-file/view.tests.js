/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */

import chai from 'chai';
import { Template } from 'meteor/templating';
import { $ } from 'meteor/jquery';
import { withRenderedTemplate } from './helpers';
import './index';

let expect = chai.expect;

describe('UploadFile', function () {
  beforeEach(function () {
    Template.registerHelper('_', key => key);
  });

  afterEach(function () {
    Template.deregisterHelper('_');
  });

  it('renders correctly', function () {
    withRenderedTemplate('UploadFile', null, el => {
      expect($(el).find('input[type=file]').length).to.eq(1);
      expect($(el).find('a.form-action').length).to.eq(1);
    });
  });
});