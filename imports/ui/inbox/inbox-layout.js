import './inbox-layout.html';

Template.InboxLayout.onRendered(function() {

});

Template.InboxLayout.helpers({
  col1Class(right, detail) {
    if (right) {
      if (detail) {
        return 'col-lg-3 hidden-md hidden-sm hidden-xs';
      } else {
        return 'col-md-5 hidden-sm hidden-xs';
      }
    } else {
      return 'col-md-12';
    }
  },
  col2Class(detail) {
    if (detail) {
      return 'col-lg-6 col-md-7 hidden-sm hidden-xs';
    } else {
      return 'col-lg-7 col-md-7 col-sm-12';
    }
  },
  col3Class() {
    return 'col-lg-3 col-md-5 col-sm-12';
  }
});