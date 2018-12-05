import './inbox-layout.html';
import './inbox-layout.css';

Template.InboxLayout.helpers({
  col1Class(right, sidebar) {
    if (right) {
      if (sidebar) {
        return 'col-lg-3 hidden-md hidden-sm hidden-xs';
      } else {
        return 'col-md-5 hidden-sm hidden-xs';
      }
    } else {
      return 'col-md-12';
    }
  },
  col2Class(sidebar) {
    if (sidebar) {
      return 'col-lg-9 col-md-12';
    } else {
      return 'col-md-7 col-sm-12';
    }
  },
  col21Class(sidebar) {
    if (sidebar) {
      return 'col-lg-8 col-md-7 hidden-sm hidden-xs';
    } else {
      return 'col-md-12';
    }
  },
  col22Class() {
    return 'col-lg-4 col-md-5 col-sm-12';
  }
});