Template.registerHelper('threadIcon', (thread) => {
  let c = ThreadCategories.get(thread.category);
  if (!c) {
    return false; // happens when data not ready
  }
  if (thread.read) {
    return typeof(c.icon) == "function" ? c.icon(thread) : c.icon;
  } else {
    return typeof(c.iconUnread) == "function" ? c.iconUnread(thread) : c.iconUnread;
  }
});

Template.registerHelper('threadTitle', (thread, detail) => {
  let c = ThreadCategories.get(thread.category);
  if (!c) {
    return false; // happens when data not ready
  }
  return typeof(c.title) == "function" ? c.title(thread, detail) : thread.subject;
});

Template.registerHelper('threadListTemplate', (thread, mode) => {
  if (mode === 'simple') {
    let tmpl = `Simple${thread.category}ListItem`;
    return eval(`Template.${tmpl}`) ? tmpl : 'SimpleThreadListItem';
  } else {
    let tmpl = `${thread.category}ListItem`;
    return eval(`Template.${tmpl}`) ? tmpl : 'ThreadListItem';
  }
});

Template.registerHelper('threadCanReply', (thread) => {
  if (!thread.category) return false;
  if (thread.category === 'Chat') {
    let chat = thread.chat();
    return chat && chat.noreply() ? false : true;
  }
  let count = ThreadUsers.find({threadId: thread._id}).count();
  let countContacts = ThreadUsers.find({threadId: thread._id, userType: 'Contacts'}).count();
  // 无内部用户参与的外部邮件，且外部邮件无须回复
  return count === 1 || (count - countContacts) > 1 || thread.hasReplyableExternalMembers();
});
