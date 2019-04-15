import '/imports/test/test-helpers';
import { parseEmailAddress } from './email-address-parser';

describe('parse email address', function() {
  it("multiple emails", function() {
    let email1 = faker.internet.email();
    let email2 = faker.internet.email();
    expect(parseEmailAddress([email1, email2].join(', ')).length).to.eq(2);
  });

  it("irregular email: ending with ','", function() {
    let email = faker.internet.email();
    let result = parseEmailAddress(email + ',');
    expect(result.length).to.eq(1);
  });

  it("irregular email: email as name", function() {
    let email = "test@example.com <test@example.com>";
    let result = parseEmailAddress(email);
    expect(result.length).to.eq(1);
  });

  it("irregular email: name including '@'", function() {
    let email = "test @ example <test@example.com>";
    let result = parseEmailAddress(email);
    expect(result.length).to.eq(1);
  });

  it("irregular emails: name including '@'", function() {
    let email = "test @ example <test@example.com>, test1 @ example <test1@example.com>";
    let result = parseEmailAddress(email);
    expect(result.length).to.eq(2);
  });

  it("irregular email: 前程job 周润发 <resume@quickmail.jobs.com>", function() {
    let email = "前程job 周润发 <resume@quickmail.jobs.com>";
    let result = parseEmailAddress(email);
    expect(result.length).to.eq(1);
    expect(result[0].address).to.eq("resume@quickmail.jobs.com");
    expect(result[0].host()).to.eq("quickmail.jobs.com");
    expect(result[0].name()).to.eq("前程Job 周润发");
    expect(result[0].user()).to.eq("resume");
  });
});
