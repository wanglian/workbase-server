/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */

import { Template } from 'meteor/templating';
import { $ } from 'meteor/jquery';
import '/imports/test/client/test-helpers';
import './index';

describe('UploadFile', () => {
  it('renders elements correctly', () => {
    withRenderedTemplate('UploadFile', null, el => {
      expect($(el).find('input[type=file]').length).to.eq(1);
      expect($(el).find('a.form-action').length).to.eq(1);
    });
  });
});