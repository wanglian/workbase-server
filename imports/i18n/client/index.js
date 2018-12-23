import '../i18next';

Template.registerHelper('_', (key, options) => {
  return I18n.t(key, options.hash);
});

Meteor.startup(function () {
  I18n.changeLanguage(currentLanguage());
});

Accounts.onLogin(function(attempt) {
  let user = Meteor.user();
  if (user.profile.language) {
    I18n.changeLanguage(user.profile.language);
  }
});
