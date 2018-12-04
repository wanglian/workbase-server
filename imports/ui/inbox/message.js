import './message.html';

Template.Message.events({
  "click .message-header"(e, t) {
    e.preventDefault();
    let m = $(e.target).closest(".message");
    m.find(".message-header .email").toggle("hide");
    m.find(".message-header .summary").toggle("hide");
    m.find(".message-content").toggle("hide");
  }
});