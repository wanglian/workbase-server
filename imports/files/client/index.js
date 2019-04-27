import "./files";
import "./helper";
import "./view";
import "./style.css";

const FileSubs = new SubsManager({
  cacheLimit: 10,
  expireIn: 5
});
Accounts.onLogout(function() {
  FileSubs.clear();
});

FilesController = ApplicationController.extend({
  template: "Files",
  perPage: 25,
  subscriptions() {
    this.filesSub = FileSubs.subscribe("files", {limit: this.limit()});
  },
  limit() {
    return parseInt(this.params.query.limit) || this.perPage;
  },
  data() {
    let query = _.clone(this.params.query);
    _.extend(query, {limit: this.limit() + this.perPage});
    let nextPath = this.route.path(this.params, {query});
    let total = Counts.get("count-files");
    let hasMore = total > this.limit();
    return {
      files:    Files.find({}, {sort: {createdAt: -1}}),
      ready:    this.filesSub.ready(),
      nextPath: hasMore ? nextPath : null
    };
  }
});

Router.route("/files/:_id?", {
  name: "files",
  controller: "FilesController"
});
