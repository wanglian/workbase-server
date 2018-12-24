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

  ThreadUsers.find({threadId: message.threadId, userType: 'Users', userId: {$ne: message.userId}}).forEach((tu) => {
    pushToUser(tu.user(), message).then((result) => {
      // console.log("[push] " + tu.userId + ' - ' + message._id);
    }).catch((e) => {
      console.log(e);
    });
  });
});

const pushToUser = (to, message) => {
  return new Promise((resolve, reject) => {
    try {
      let thread = message.thread();
      let from   = message.user();

      let params = {
        from:  'Test',
        // title:
        // text:
        badge: 1,
        sound: 'default',
        query: {
          userId: to._id
        }
      };

      switch(thread.category) {
      case 'Chat':
        let text = message.summary;
        if (message.contentType === 'image') {
          text = I18n.getFixedT(to.profile.language)("Sent you an image");
        }
        _.extend(params, {
          title: from.internalName(),
          text
        });
        break;
      default:
        _.extend(params, {
          title: from.internalName() + ': ' + thread.subject,
          text:  message.summary,
        });
      }

      // console.log(params);
      Push.send(params);

      resolve(true);
    } catch (e) {
      reject(e);
    }
  });
};

