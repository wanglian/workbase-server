Meteor.startup(function() {
  Push.Configure({
    // ios
    apn: {
      // certData: Assets.getText('workbase-push-cert-dev.pem'),
      // keyData:  Assets.getText('workbase-push-key-dev.pem'),
      certData: Assets.getText('workbase-push-cert.pem'),
      keyData:  Assets.getText('workbase-push-key.pem'),
      passphrase: 'workbase',
      production: true,
      // gateway: 'gateway.push.apple.com',
      // gateway: 'gateway.sandbox.push.apple.com'
    },
    // android
    // gcm: {
    //   apiKey: 'AAAA-pjrQnc:APA91bHSIL4scYbVgIEdcetalP6mK3DEsaJzGbk1P30OxVvXaZD5wCtq4eoyoGRP0LhPbRmBlfPzBpNUa1BxuRil11pXtRIN2LGSj4Tx_6_y5A_Pc9dBekK-nFJ0TdNdKzkh6Kl_TAt_',  // GCM/FCM server key
    //   projectNumber: 1076307378807
    // },
    // production: true,
    // sound: true,
    // badge: true,
    // alert: true,
    // vibrate: true
    // 'sendInterval': 15000, Configurable interval between sending
    // 'sendBatchSize': 1, Configurable number of notifications to send per batch
    // 'keepNotifications': false,
  //
  });
  Push.debug = true;
});

const pushToUser = (to, message) => {
  return new Promise(function(resolve, reject) {
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
        let text = message.localizedSummary(to.language());
        if (message.contentType === 'image') {
          text = I18n.getFixedT(to.profile.language)("message_got_image");
        }
        _.extend(params, {
          title: from.internalName(),
          text
        });
        break;
      case 'Shared':
        if (message.parentId) {
          _.extend(params, {
            title: `${from.internalName()} ${I18n.getFixedT(to.profile.language)("share_comment_added")}`,
            text: message.localizedSummary(to.language())
          });
        } else {
          _.extend(params, {
            title: `${from.internalName()} ${I18n.getFixedT(to.profile.language)("shared")}`,
            text: message.localizedSummary(to.language())
          });
        }
        break;
      default:
        _.extend(params, {
          title: from.internalName() + ': ' + thread.subject,
          text:  message.localizedSummary(to.language())
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

Messages.after.insert(function(userId, doc) {
  if (Meteor.isAppTest) return;
  let message = this.transform();

  ThreadUsers.find({threadId: message.threadId, userType: 'Users', userId: {$ne: message.userId}}).forEach((tu) => {
    if (tu.spam) return;

    pushToUser(tu.user(), message).then((result) => {
      // console.log("[push] " + tu.userId + ' - ' + message._id);
    }).catch((e) => {
      console.log("Push error:");
      console.log(e);
    });
  });
});
