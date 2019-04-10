/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */

import '/imports/test/client/test-helpers';
import './index';

describe('LinkToSendEmail', () => {
  it('when email enabled, renders elements correctly', () => {
    Instance.emailEnabled = sinon.fake.returns(true);
    withRenderedTemplate('LinkToSendEmail', null, el => {
      expect($(el).find('a#btn-send-email').length).to.eq(1);
    });
  });

  it('when email disabled, renders nothing', () => {
    Instance.emailEnabled = sinon.fake.returns(false);
    withRenderedTemplate('LinkToSendEmail', null, el => {
      expect($(el).find('a#btn-send-email').length).to.eq(0);
    });
  });
});

describe('SendEmailModal', () => {
  it('renders elements correctly', () => {
    withRenderedTemplate('SendEmailModal', null, el => {
      expect($(el).find('button.close').length).to.eq(1);
      expect($(el).find('form#send-email-form').length).to.eq(1);
      expect($(el).find('input[name=to]').length).to.eq(1);
      expect($(el).find('input[name=subject]').length).to.eq(1);
      expect($(el).find('textarea[name=content]').length).to.eq(1);
      expect($(el).find('button[type=submit]').length).to.eq(1);
    });
  });
});