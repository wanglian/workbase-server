Meteor.startup(function () {
  Status.setTemplate('default'); // bootstrap3
  let lng = currentLanguage();
  if (lng === 'zh-CN') lng = 'zh';
  TAPi18n.setLanguage(lng);
});
