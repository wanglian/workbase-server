ThreadCategories.add("Shared", {
  icon: "fa fa-connectdevelop fa-1-2x",
  iconUnread: "fa fa-connectdevelop fa-1-2x",
  description: "TODO: ",
  title(thread) { // client only
    return I18n.t(thread.subject);
  },
  details: false
});
