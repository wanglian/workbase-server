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
};
Messages.before.insert(function(userId, doc) {
  doc.createdAt = new Date();
  _.defaults(doc, {internal: false});
  let strippedText = purgeHtml(doc.content) || "no text content";
  doc.summary = strippedText.slice(0, 250);
});
