import './view.html';

Template.LogMessage.helpers({
  content() {
    let data = this.content;
    let log = LogTypes.get(data.action);
    return log ? I18n.t(log.i18nKey, data.params) : data;
  }
});
