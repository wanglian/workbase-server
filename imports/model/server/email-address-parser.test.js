import '/imports/test/test-helpers';
import { parseEmailAddress } from './email-address-parser';

describe('parse email address', function() {
  it("multiple emails", function() {
    let email1 = faker.internet.email();
    let email2 = faker.internet.email();
    expect(parseEmailAddress([email1, email2].join(', ')).length).to.eq(2);
  });

  it("emails including ','", function() {
    let email = faker.internet.email();
    let result = parseEmailAddress(email + ',');
    expect(result.length).to.eq(1);
  });

  it("email as name", function() {
    let email = faker.internet.email();
    let result = parseEmailAddress(email + '<' + email + '>');
    expect(result.length).to.eq(1);
  });

  it("name including '@'", function() {
    let email = faker.internet.email();
    let result = parseEmailAddress("some @ body" + '<' + email + '>');
    expect(result.length).to.eq(1);
  });

  it("irregular email: 前程job 周润发 <resume@quickmail.jobs.com>", function() {
    let email = "前程job 周润发 <resume@quickmail.jobs.com>";
    let result = parseEmailAddress(email);
    expect(result.length).to.eq(1);
  });
});
