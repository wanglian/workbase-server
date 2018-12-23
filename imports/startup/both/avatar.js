Meteor.startup(function() {
  Avatar.setOptions({
    // defaultImageUrl: ""
    // generateCSS: false,
    imageSizes: {
      'profile': 180,
      'xlarge': 90,
      'large': 65,
      'medium': 40,
      'small': 35,
      'tiny': 30,
    },
    customImageProperty: function() {
      return this.profile && this.profile.avatar;
    }
  });
});