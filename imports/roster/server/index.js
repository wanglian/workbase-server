import '../roster';
import './methods';

Instance.after.update(function(userId, doc, fieldNames, modifier, options) {
  // admin
  if (fieldNames.includes('adminId')) {
    let admin = Instance.admin();
    let thread = Threads.findOne({category: 'Roster'});
    if (!thread) {
      let threadId = Threads.create(admin, 'Roster', 'Users Management');
      thread = Threads.findOne(threadId);
    }

    Threads.ensureMember(thread, admin);
  }
});
