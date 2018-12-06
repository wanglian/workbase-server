Threads.before.insert(function(userId, doc) {
  if (doc.userType === 'Channel') {
    doc.scope = "protected";
  }
});
