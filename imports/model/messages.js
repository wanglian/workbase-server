// - threadId
// - userType: user, contact
// - userId
// - internal: boolean
// - content
// - summary
// - emailId
// - email: from, to, cc, time
Messages = new Mongo.Collection('messages');

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

Messages.helpers({
  user() {
    return eval(this.userType).findOne(this.userId);
  }
});
