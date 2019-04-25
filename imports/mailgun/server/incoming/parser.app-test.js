import { resetDatabase } from 'meteor/xolvio:cleaner';
import '/imports/test/test-helpers';
import '/imports/test/server/generate-data.app-test';
import '../index';

describe('parse Mailgun email', function() {
  let user;

  beforeEach(function() {
    resetDatabase();
    let instance = createInstance();
    user = Users.findOne(instance.adminId);
  });

  it('one to one: recipient === to', async function() {
    let email = Factory.create('email');
    email.emailId = email.params["Message-Id"];
    email.params["To"] = user.email();
    email.params["recipient"] = user.email();

    await parseMailgunEmail(email);
    let thread = Threads.findOne({category: 'Chat'}, {order: {createdAt: -1}});
    expect(thread.subject).to.eq(email.params["subject"]);
    expect(ThreadUsers.find({threadId: thread._id}).count()).to.eq(2);
    expect(ThreadUsers.find({threadId: thread._id, role: "owner"}).count()).to.eq(2);
    let message = Messages.findOne({threadId: thread._id});
    expect(message.content).to.exist;
    expect(message.userType).to.eq("Contacts");
  });

  it('one to one: no param To', async function() {
    let email = Factory.create('email');
    email.emailId = email.params["Message-Id"];
    email.params["To"] = null;
    email.params["recipient"] = user.email();

    await parseMailgunEmail(email);
    let thread = Threads.findOne({category: 'Chat'}, {order: {createdAt: -1}});
    expect(thread.subject).to.eq(email.params["subject"]);
    expect(ThreadUsers.find({threadId: thread._id}).count()).to.eq(2);
    expect(ThreadUsers.find({threadId: thread._id, role: "owner"}).count()).to.eq(2);
    let message = Messages.findOne({threadId: thread._id});
    expect(message.content).to.exist;
    expect(message.userType).to.eq("Contacts");
  });

  it('one to one: recipient !== to', async function() {
    let email = Factory.create('email');
    email.emailId = email.params["Message-Id"];
    email.params["recipient"] = user.email();

    await parseMailgunEmail(email);
    let thread = Threads.findOne({category: 'Chat'}, {order: {createdAt: -1}});
    expect(thread.subject).to.eq(email.params["subject"]);
    expect(ThreadUsers.find({threadId: thread._id}).count()).to.eq(2);
    let message = Messages.findOne({threadId: thread._id});
    expect(message.content).to.exist;
    expect(message.userType).to.eq("Contacts");
  });

  it('cc', async function() {
    let email = Factory.create('email');
    email.emailId = email.params["Message-Id"];
    email.params["To"] = user.email();
    email.params["recipient"] = user.email();
    email.params["Cc"] = faker.internet.email();

    await parseMailgunEmail(email);
    let thread = Threads.findOne({category: 'Email'}, {order: {createdAt: -1}});
    expect(thread.subject).to.eq(email.params["subject"]);
    expect(ThreadUsers.find({threadId: thread._id}).count()).to.eq(3);
    let message = Messages.findOne({threadId: thread._id});
    expect(message.content).to.exist;
    expect(message.userType).to.eq("Contacts");
  });

  it('should remove the origin email when parsed successfully', async function() {
    let email = Factory.create('email');
    email.emailId = email.params["Message-Id"];
    email.params["To"] = user.email();
    email.params["recipient"] = user.email();

    await parseMailgunEmail(email);
    email = MailgunEmails.findOne(email._id);
    should.not.exist(email);
  });
});
