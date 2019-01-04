import './files';
import './helper';
import './view';
import './style.css';

FilesController = ApplicationController.extend({
  template: 'Files',
  perPage: 25,
  subscriptions() {
    this.filesSub = this.subscribe("files", {limit: this.limit()});
  },
  limit: function() {
    return parseInt(this.params.query.limit) || this.perPage;
  },
  data() {
    let query = _.clone(this.params.query);
    _.extend(query, {limit: this.limit() + this.perPage});
    let nextPath = this.route.path(this.params, {query});
    let count = Counts.get('files');
    let hasMore = count > this.limit();
    return {
      count,
      files:    Files.find({}, {sort: {createdAt: -1}}),
      ready:    this.filesSub.ready(),
      nextPath: hasMore ? nextPath : null
    };
  }
});

Router.route('/files/:_id?', {
  name: 'files',
  controller: 'FilesController'
});
