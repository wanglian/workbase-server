import './message.html';
import './message.css';

Template.Message.helpers({
  userName() {
    let user = this.user();
    if (!user) return;

    switch(this.userType) {
    case 'Users':
      return user.name();
    default:
      return user.address();
    }
  }
});

Template.Message.events({
  "click .message-header"(e, t) {
    e.preventDefault();
    if (e.shiftKey) {
      let m = $(e.target).closest(".message");
      if ($(m).find(".message-content").hasClass("hide")) {
        _.each($(".message"), (m) => {
          if ($(m).find(".message-content").hasClass("hide")) {
            toggleMessage(m);
          }
        });
      } else {
        _.each($(".message"), (m) => {
          if (!$(m).find(".message-content").hasClass("hide")) {
            toggleMessage(m);
          }
        });
      }
    } else {
      let m = $(e.target).closest(".message");
      toggleMessage(m);
    }
  }
});

const toggleMessage = (m) => {
  $(m).find(".message-header .email").toggleClass("hide");
  $(m).find(".message-header .summary").toggleClass("hide");
  $(m).find(".message-content").toggleClass("hide");
};