import './application-layout.html';
import './style.css';

Template.ApplicationLayout.onRendered(function() {
  Tracker.autorun(() => {
    let title = Instance.company();
    let count = Counts.get('count-unread-inbox');
    document.title = (count > 0) ? `(${count}) ${title}` : title;
  });
});
