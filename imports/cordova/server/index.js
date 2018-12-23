Meteor.startup(function() {
  Push.Configure({
    apn: {
      // certData: Assets.getText('workbase-push-cert-dev.pem'),
      // keyData:  Assets.getText('workbase-push-key-dev.pem'),
      certData: Assets.getText('workbase-push-cert.pem'),
      keyData:  Assets.getText('workbase-push-key.pem'),
      passphrase: 'workbase',
      production: true,
      //gateway: 'gateway.push.apple.com',
      // gateway: 'gateway.sandbox.push.apple.com'
    },
    // gcm: {
    //   apiKey: 'xxxxxxx',  // GCM/FCM server key
    // }
    production: true,
    sound: true,
    badge: true,
    alert: true,
    vibrate: true
    // 'sendInterval': 15000, Configurable interval between sending
    // 'sendBatchSize': 1, Configurable number of notifications to send per batch
    // 'keepNotifications': false,
  //
  });
  Push.debug = true;
});

Messages.after.insert(function(userId, doc) {
  let message = this.transform();

  // push
  let userIds = ThreadUsers.find({threadId: message.threadId, userType: 'Users', userId: {$ne: message.userId}}).map(tu => tu.userId);
  if (!_.isEmpty(userIds)) {
    let thread = message.thread();
    let user   = message.user();
    Push.send({
      from:  'Test',
      title: user.internalName() + ': ' + thread.subject,
      text:  message.summary,
      badge: 1,
      sound: 'default',
      query: {
        userId: {$in: userIds}
      }
    });
  }
});
