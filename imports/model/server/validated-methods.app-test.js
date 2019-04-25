import { resetDatabase } from 'meteor/xolvio:cleaner';
import '/imports/test/test-helpers';
import '../methods';

describe('ValidatedMethods', function() {
  let userId, threadId, threadUserId, messageId;

  beforeEach(function() {
    resetDatabase();
    userId = faker.random.uuid();
    let thread = Factory.create('thread', {userId});
    threadId = thread._id;
    let threadUser = Factory.create('thread-user', {userId, threadId});
    threadUserId = threadUser._id;
    let message = Factory.create('message', {userId, threadId});
    messageId = message._id;
  });
  
  it("markRead - should mark a thread as read", function() {
    markRead._execute({userId}, {threadId});
    let threadUser = ThreadUsers.findOne(threadUserId);
    expect(threadUser.read).to.eq(true);
  });

  it("saveThreadContent - should update thread's content", function() {
    let content = faker.lorem.paragraph()
    saveThreadContent._execute({userId}, {threadId, content});
    let thread = Threads.findOne(threadId);
    expect(thread.content).to.eq(content);
  });

  it("toggleArchiveThread - should toggle a thread as archive", function() {
    toggleArchiveThread._execute({userId}, {threadId});
    let threadUser = ThreadUsers.findOne(threadUserId);
    expect(threadUser.archive).to.eq(true);

    toggleArchiveThread._execute({userId}, {threadId});
    threadUser = ThreadUsers.findOne(threadUserId);
    expect(threadUser.archive).to.eq(false);
  });

  it("toggleSpamThread - should toggle a thread as spam", function() {
    toggleSpamThread._execute({userId}, {threadId});
    let threadUser = ThreadUsers.findOne(threadUserId);
    expect(threadUser.spam).to.eq(true);

    toggleSpamThread._execute({userId}, {threadId});
    threadUser = ThreadUsers.findOne(threadUserId);
    expect(threadUser.spam).to.eq(false);
  });

  it("toggleStarThread - should toggle a thread as spam", function() {
    toggleStarThread._execute({userId}, {threadId});
    let threadUser = ThreadUsers.findOne(threadUserId);
    expect(threadUser.star).to.eq(true);

    toggleStarThread._execute({userId}, {threadId});
    threadUser = ThreadUsers.findOne(threadUserId);
    expect(threadUser.star).to.eq(false);
  });

  it("togglePinMessage - should toggle a message as pin", function() {
    togglePinMessage._execute({userId}, {messageId});
    let message = Messages.findOne(messageId);
    expect(message.pinUserId).to.eq(userId);
    should.exist(message.pinAt);

    togglePinMessage._execute({userId}, {messageId});
    message = Messages.findOne(messageId);
    should.not.exist(message.pinUserId);
    should.not.exist(message.pinAt);
  });

  it("updateMessage - should update message's content", function() {
    let content = faker.lorem.paragraph();
    updateMessage._execute({userId}, {messageId, content});
    let message = Messages.findOne(messageId);
    expect(message.content).to.eq(content);
  });
});
