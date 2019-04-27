import { Instance } from '/imports/model/instance';
import { Users } from '/imports/model/users';
import { Threads } from '/imports/model/threads';
import { ThreadUsers } from '/imports/model/thread-users';
import { Messages } from '/imports/model/messages';
import { MailgunEmails } from '/imports/mailgun/mailgun-emails';

Factory.define('instance', Instance, {
  company: () => faker.company.companyName(),
  domain:  () => faker.internet.domainName(),
  adminId: () => faker.random.uuid()
});

Factory.define('user', Users, {
  profile: {
    type: () => 'Users'
  },
  emails() {
    return [{
      address: faker.internet.email(),
      verified: false,
    }];
  },
});

Factory.define('thread', Threads, {
  subject: () => faker.lorem.sentence(),
  userId:  () => faker.random.uuid(),
  scope:   'private'
});

Factory.define('thread-user', ThreadUsers, {
  category: 'Thread',
  scope: 'private',
  userType: 'Users',
  read: false,
  archive: false
});

Factory.define('message', Messages, {
  userType: "Users",
  userId: () => faker.random.uuid(),
  content: () => faker.lorem.paragraph(),
  contentType: "text"
});

Factory.define('email', MailgunEmails, {
  params: () => {
    return {
      "subject":    faker.lorem.sentence(),
      "from":       faker.internet.email(),
      "To":         faker.internet.email(),
      "recipient":  faker.internet.email(),
      "Message-Id": faker.random.uuid(),
      "body-plain": faker.lorem.paragraph(),
      "body-html":  faker.lorem.paragraph(),
      "Date":       new Date()
    };
  }
});
