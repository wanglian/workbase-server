// - threadId
// - userType: user, contact
// - userId
// - content
// - summary
// - emailId
Messages = new Mongo.Collection('messages');

const sanitizeHtml = require('sanitize-html');
const purgeHtml = (html) => {
  return html && _.unescape(sanitizeHtml(html, {allowedTags: [], allowedAttributes: []}).trim());
}

Messages.before.insert(function(userId, doc) {
  doc.createdAt = new Date();
  let strippedText = purgeHtml(doc.content) || "没有文本内容";
  doc.summary = strippedText.slice(0, 250);
});

Messages.helpers({
  user() {
    return eval(this.userType).findOne(this.userId);
  }
});
