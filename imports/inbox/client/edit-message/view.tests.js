/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */

import '/imports/test/client/test-helpers';
import './index';

describe('EditMessageButton', () => {
  it('if can edit, renders elements correctly', () => {
    let message = Factory.build('message', {internal: true});
    Meteor.userId = sinon.fake.returns(message.userId);
    withRenderedTemplate('EditMessageButton', message, (el) => {
      expect($(el).find('button.btn-edit').length).to.eq(1);
    });
  });

  it('if can not edit, renders nothing', () => {
    let message = Factory.build('message', {internal: false});
    withRenderedTemplate('EditMessageButton', message, (el) => {
      expect($(el).find('button.btn-edit').length).to.eq(0);
    });
  });
});

describe('EditMessageModal', () => {
  it('renders elements correctly', () => {
    let message = Factory.build('message', {internal: true});
    withRenderedTemplate('EditMessageModal', message, (el) => {
      expect($(el).find('button.close').length).to.eq(1);
      expect($(el).find('form#edit-message-form').length).to.eq(1);
      expect($(el).find('textarea[name=content]').length).to.eq(1);
      expect($(el).find('textarea[name=content]').val()).to.eq(message.content);
      expect($(el).find('button[type=submit]').length).to.eq(1);
    });
  });
});