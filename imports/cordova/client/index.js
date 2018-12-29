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

  if (Meteor.isCordova) {
    cordova.plugins.diagnostic.isCameraAuthorized(
      authorized => {
        if (!authorized) {
          cordova.plugins.diagnostic.requestCameraAuthorization(
            granted => {
              console.log( "Authorization request for camera use was " +
                (granted ? "granted" : "denied"));
            },
            error => { console.error(error); }
          );
        }
      },
      error => { console.error(error); }
    );

    document.addEventListener("deviceready", () => {
      window.open = cordova.InAppBrowser.open;
    }, false);

    window.addEventListener('statusTap', function() {
      $('.scroll-box').animate({ scrollTop: 0 }, "fast");
    });

    // badge
    Tracker.autorun(() => {
      let count = Counts.get('count-unread-inbox');
      Push.setBadge(count);
    });
  }
});