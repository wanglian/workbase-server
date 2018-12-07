import './roster-menu-item.html';

Template.RosterMenuItem.helpers({
  isRoster() {
    return Router.current().route.getName() === 'roster';
  }
});
