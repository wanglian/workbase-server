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

      // server
      let prefs = plugins.appPreferences;
      prefs.fetch((value) => {
        console.log("We got a setting: " + value);
        if (value) {
          window.localStorage.setItem("__root_url", value);
        }
      }, (error) => {
        console.log("Failed to retrieve a setting: " + error);
      }, 'server');
    }, false);

    window.addEventListener('statusTap', function() {
      $('.scroll-box').animate({ scrollTop: 0 }, "fast");
    });

    // badge
    Tracker.autorun(() => {
      // inbox
      let count = Counts.get('count-unread-inbox');
      // shared
      let shared = ThreadUsers.findOne({category: 'Shared', userType: 'Users', userId: Meteor.userId()});
      Push.setBadge(count);
    });
  }
});