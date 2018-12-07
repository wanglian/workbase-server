Threads.before.insert(function(userId, doc) {
  doc.createdAt = new Date();
  doc.updatedAt = new Date();
  _.defaults(doc, {scope: 'private'});
});

Threads.before.update(function(userId, doc, fieldNames, modifier, options) {
  modifier.$set = modifier.$set || {};
  modifier.$set.updatedAt = new Date();
});

ThreadUsers.before.insert(function(userId, doc) {
  doc.createdAt = new Date();
  doc.updatedAt = new Date();
});

ThreadUsers.before.update(function(userId, doc, fieldNames, modifier, options) {
  modifier.$set = modifier.$set || {};
  modifier.$set.updatedAt = new Date();
});

const sanitizeHtml = require('sanitize-html');
const purgeHtml = (html) => {
  return html && _.unescape(sanitizeHtml(html, {allowedTags: [], allowedAttributes: []}).trim());
}
Messages.before.insert(function(userId, doc) {
  doc.createdAt = new Date();
  _.defaults(doc, {internal: false});
  let strippedText = purgeHtml(doc.content) || "no text content";
  doc.summary = strippedText.slice(0, 250);
});

Accounts.onLogin(function(attempt) {
  let user = Users.findOne(attempt.user._id);
  // welcome
  if (ThreadUsers.find({userType: 'Users', userId: user._id}).count() === 0) {
    let root = Contacts.findOne({email: Instance.root.email});
    let threadId = Threads.create(root, 'Email', 'Welcome to WeWork!');
    let thread = Threads.findOne(threadId);
    Threads.ensureMember(thread, user);
    Threads.ensureMember(thread, root);
    Threads.addMessage(thread, root, {
      content: "If you have any question, just ask me here..."
    });
  }
});
