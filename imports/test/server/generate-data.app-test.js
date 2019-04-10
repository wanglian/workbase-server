// This file will be auto-imported in the app-test context, ensuring the method is always available
import { resetDatabase } from 'meteor/xolvio:cleaner';
import '../test-helpers';
import '/imports/model';

createInstance = () => {
  let domain = faker.internet.domainName();
  let firstName = faker.name.firstName();
  let lastName = faker.name.lastName();
  let userId = Accounts.createUser({
    email: faker.internet.email(firstName, lastName, domain),
    profile: {
      type: 'Users',
      name: firstName + ' ' + lastName
    }
  });
  let instance = Factory.create('instance', {adminId: userId});
  let user = Users.findOne(userId);
  let thread = Factory.create('thread', {userId, category: 'Account'});
  Threads.ensureMember(thread, user);
  return instance;
};

Meteor.methods({
  generateFixtures(userId) {
    resetDatabase();
    createInstance();
  },
});
