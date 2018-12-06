import '../channel-users';
import './hooks';
import './functions';
import './publications';

Meteor.startup(function() {
  let email = "sales@weaworking.com";
  let channel = Accounts.findUserByEmail(email);
  let channelId = (channel && channel._id) || Channels.create(email, 'Sales')

  let user = Accounts.findUserByEmail('wanglian@weaworking.com');
  ChannelUsers.ensureMember(channelId, user._id);
});
