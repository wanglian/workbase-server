Template.registerHelper('company', function() {
  return Instance.company();
});

Template.registerHelper('countUnread', function() {
  return Counts.get('count-unread-inbox');
});

Template.registerHelper('countUnreadChannel', function(channel) {
  return Counts.get(`count-unread-channel-${channel}`);
});

Template.registerHelper('domain', function() {
  return Instance.domain();
});

Template.registerHelper('isMe', (user) => {
  return Meteor.user().isMe(user);
});

Template.registerHelper('inRouter', function(router) {
  return Router.current().route.getName() === router;
});

currentLanguage = () => {
  return window.navigator.language;
};
Template.registerHelper('currentLanguage', currentLanguage);
