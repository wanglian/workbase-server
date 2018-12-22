import '../i18next';

Template.registerHelper('_', (key, options) => {
  return I18n.t(key, options.hash);
});

Meteor.startup(function () {
  I18n.changeLanguage(currentLanguage());
});
