Meteor.startup(function() {
  Push.Configure({
    // android: {
    //   senderID: 12341234,
    //   alert: true,
    //   badge: true,
    //   sound: true,
    //   vibrate: true,
    //   clearNotifications: true
    //   // icon: '',
    //   // iconColor: ''
    // },
    ios: {
      alert: true,
      badge: true,
      sound: true
    }
  });
  
  Tracker.autorun(() => {
    if (Meteor.isCordova) {
      let count = Counts.get('count-unread-inbox');
      Push.setBadge(count);
    }
  });
});