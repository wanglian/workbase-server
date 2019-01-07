import './view.html';

Template.LogContent.helpers({
  content() {
    let data = this.message.content;
    let log = LogTypes.get(data.action);
    return log ? I18n.t(log.i18nKey, data.params) : data;
    // switch(data.action) {
    // case 'thread.add_members':
    //   return I18n.t("add_thread_member", data.params);
    // case 'thread.remove_member':
    //   return I18n.t("remove_thread_member", data.params);
    // default:
    //   return data;
    // }
  }
});
