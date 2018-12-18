let chai = require('chai');
let expect = chai.expect;

describe('Contact', function () {
  beforeEach(function () {
    Contacts.remove({});
  });

  // noreply|no_reply|no-reply|do-not-reply|do_not_reply
  it("identify noreply", function() {
    let email = "noreply@test.com";
    let contact = Contacts.parseOne(email);
    expect(contact.noreply).to.eq(true);
  });
});