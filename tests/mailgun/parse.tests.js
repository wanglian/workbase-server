// import { resetDatabase } from 'meteor/xolvio:cleaner';

let chai = require('chai');

let expect = chai.expect;

describe('parse Mailgun email', function() {
  beforeEach(function() {
    // resetDatabase();
    MailgunEmails.remove({});
    Threads.remove({});
    ThreadUsers.remove({});
    Contacts.remove({});
    Messages.remove({});
  });

  it('one to one', function() {
    let params = {
      "recipient": "wanglian@weaworking.com",
      "subject": "test",
      "From": "Lian Wang <wanglian1024@gmail.com>",
      "Date": "Sun, 2 Dec 2018 14:57:52 -0500",
      "Message-Id": "<CA+RGZYS3dzmA=z10b8yFVB7FWJo2JyM2jQLiAS4+RXZwcgNCPQ@mail.gmail.com>",
      "Subject": "test",
      "To": "Wang Lian <wanglian@weaworking.com>",
      "timestamp": "1543780685",
      "body-plain": "test\r\n\r\n-- \r\nWang Lian\r\n",
      "body-html": "<div dir=\"ltr\">test<br clear=\"all\"><div><br></div>-- <br><div dir=\"ltr\" class=\"gmail_signature\" data-smartmail=\"gmail_signature\">Wang Lian</div></div>\r\n",
      "stripped-html": "<div dir=\"ltr\">test<br clear=\"all\"><div><br></div>-- <br><div dir=\"ltr\" class=\"gmail_signature\" data-smartmail=\"gmail_signature\">Wang Lian</div></div>\n",
      "stripped-text": "test",
      "stripped-signature": "-- \r\nWang Lian"
    };

    let id =MailgunEmails.create(params);
    expect(id).to.exist;

    let thread = Threads.findOne();
    expect(thread.subject).to.eq(params["subject"]);
    let count = ThreadUsers.find({threadId: thread._id}).count();
    expect(count).to.eq(2);
    let message = Messages.findOne({threadId: thread._id});
    expect(message.content).to.exist;
    expect(message.userType).to.eq("Contacts");
  });

  it('recipient != to', function() {
    let params = {
      "recipient": "wanglian@weaworking.com",
      "subject": "test",
      "From": "Lian Wang <wanglian1024@gmail.com>",
      "Date": "Sun, 2 Dec 2018 14:57:52 -0500",
      "Message-Id": "<CA+RGZYS3dzmA=z10b8yFVB7FWJo2JyM2jQLiAS4+RXZwcgNCPQ@mail.gmail.com>",
      "Subject": "test",
      "To": "Test <test@test.com>",
      "timestamp": "1543780685",
      "body-plain": "test\r\n\r\n-- \r\nWang Lian\r\n",
      "body-html": "<div dir=\"ltr\">test<br clear=\"all\"><div><br></div>-- <br><div dir=\"ltr\" class=\"gmail_signature\" data-smartmail=\"gmail_signature\">Wang Lian</div></div>\r\n",
      "stripped-html": "<div dir=\"ltr\">test<br clear=\"all\"><div><br></div>-- <br><div dir=\"ltr\" class=\"gmail_signature\" data-smartmail=\"gmail_signature\">Wang Lian</div></div>\n",
      "stripped-text": "test",
      "stripped-signature": "-- \r\nWang Lian"
    };

    let id =MailgunEmails.create(params);
    expect(id).to.exist;

    let thread = Threads.findOne();
    expect(thread.subject).to.eq(params["subject"]);
    let count = ThreadUsers.find({threadId: thread._id}).count();
    expect(count).to.eq(3);
    let message = Messages.findOne({threadId: thread._id});
    expect(message.content).to.exist;
    expect(message.userType).to.eq("Contacts");
  });

  it('cc', function() {
    let params = {
      "recipient": "wanglian@weaworking.com",
      "subject": "test",
      "From": "Lian Wang <wanglian1024@gmail.com>",
      "Date": "Sun, 2 Dec 2018 14:57:52 -0500",
      "Message-Id": "<CA+RGZYS3dzmA=z10b8yFVB7FWJo2JyM2jQLiAS4+RXZwcgNCPQ@mail.gmail.com>",
      "Subject": "test",
      "To": "Test <test@test.com>",
      "Cc": "cc <cc@test.com>",
      "timestamp": "1543780685",
      "body-plain": "test\r\n\r\n-- \r\nWang Lian\r\n",
      "body-html": "<div dir=\"ltr\">test<br clear=\"all\"><div><br></div>-- <br><div dir=\"ltr\" class=\"gmail_signature\" data-smartmail=\"gmail_signature\">Wang Lian</div></div>\r\n",
      "stripped-html": "<div dir=\"ltr\">test<br clear=\"all\"><div><br></div>-- <br><div dir=\"ltr\" class=\"gmail_signature\" data-smartmail=\"gmail_signature\">Wang Lian</div></div>\n",
      "stripped-text": "test",
      "stripped-signature": "-- \r\nWang Lian"
    };

    let id =MailgunEmails.create(params);
    expect(id).to.exist;

    let thread = Threads.findOne();
    expect(thread.subject).to.eq(params["subject"]);
    let count = ThreadUsers.find({threadId: thread._id}).count();
    expect(count).to.eq(4);
    let message = Messages.findOne({threadId: thread._id});
    expect(message.content).to.exist;
    expect(message.userType).to.eq("Contacts");
  });
});
