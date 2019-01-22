import './server-picker.html';

Template.ServerPicker.events({
  "change .server-address"(e, t) {
    let old = __meteor_runtime_config__.DDP_DEFAULT_CONNECTION_URL;
    let nw = t.$(".server-address").val();

    window.localStorage.setItem("__root_url", nw);
    if(old != nw){
      console.log("Reload for server change!!");
      window.location.reload();
    }
  }
});

Template.ServerPicker.helpers({
  selected() {
    return window.localStorage.getItem("__root_url") == this.valueOf()? {selected: true} : {};
  },
  currentServer() {
    return window.localStorage.getItem("__root_url");
  }
});
