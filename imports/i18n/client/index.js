import '../i18next';

Template.registerHelper('_', (key, options) => {
  return I18n.t(key, options.hash);
});

const setLocale = (lng) => {
  I18n.changeLanguage(lng);
  // moment
  moment.locale(lng.toLowerCase());
  // status
  if (lng === 'zh-CN') lng = 'zh';
  TAPi18n.setLanguage(lng);
}

Meteor.startup(function () {
  setLocale(currentLanguage());
});

Accounts.onLogin(function(attempt) {
  // console.log("on login ..");
  let user = Meteor.user();
  let lng = user.profile.language;
  if (lng) {
    setLocale(lng);
  }
});
