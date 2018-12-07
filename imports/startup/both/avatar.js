Meteor.startup(function() {
  Avatar.setOptions({
    // defaultImageUrl: ""
    imageSizes: {
      'xlarge': 90,
      'large': 65,
      'medium': 40,
      'small': 35,
      'tiny': 30,
    }
  });
});