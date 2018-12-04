Meteor.startup(function() {
  Avatar.setOptions({
    // defaultImageUrl: ""
    imageSizes: {
      'large': 80,
      'medium': 40,
      'small': 30,
    }
  });
});