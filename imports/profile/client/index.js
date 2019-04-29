import '../account';
import './avatar-files';
import './profile';
import './style.css';

ThreadCategories.add("Account", {
  icon: "fa fa-cog fa-1-2x",
  iconUnread: "fa fa-cog fa-1-2x",
  title(thread) { // client only
    return I18n.t(thread.subject);
  },
  details: false,
  actions() {
    return [
      {
        title: I18n.t('app_profile'),
        icon: "fa fa-cog",
        action() {
          Modal.show('ProfileModal', null, {
            backdrop: 'static'
          });
        }
      },
      // {
      //   title: I18n.t('share_title'),
      //   action() {
      //     Router.go('shared', {_id: Meteor.userId()});
      //   }
      // },
      {
        title: I18n.t('app_sign_out'),
        icon: "fa fa-sign-out",
        action() {
          Meteor.logout();
        }
      }
    ];
  }
});

Router.route('/profile', function() {
  let account = Threads.findOne({category: 'Account', userId: Meteor.userId()});
  Router.go('inbox', {_id: account._id});
}, {
  name: 'profile'
});
