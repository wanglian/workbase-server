import './view.html';

Template.LogContent.helpers({
  content() {
    let data = this.message.content;
    let log = LogTypes.get(data.action);
    return log ? I18n.t(log.i18nKey, data.params) : data;
  }
});
