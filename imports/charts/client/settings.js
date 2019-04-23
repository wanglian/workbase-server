import './settings.html';

Template.SettingCompanyModal.helpers({
  instance() {
    return Instance.get();
  }
});

Template.SettingEmailModal.helpers({
  instance() {
    return Instance.get();
  }
});

Template.SettingStorageModal.helpers({
  instance() {
    return Instance.get();
  }
});
