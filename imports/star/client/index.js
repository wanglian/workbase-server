import './view';

const StarSubs = new SubsManager({
  cacheLimit: 10,
  expireIn: 60
});

StarController = BoxController.extend({
  template: 'Star',
  subscriptions() {
    this.sub = StarSubs.subscribe("threads.star", {limit: this.limit()});
    let threadId = this.threadId();
    if (threadId) {
      StarSubs.subscribe("thread", threadId);
      StarSubs.subscribe("thread.files.pending", threadId);
    }
  },
  threads() {
    return Threads.find({star: true, archive: false}, {sort: {updatedAt: -1}});
  },
  nextPath() {
    let count = Counts.get('count-star');
    if (count > this.limit()) {
      let query = _.clone(this.params.query);
      _.extend(query, {limit: this.limit() + this.perPage});
      return this.route.path(this.params, {query});
    }
  }
});

Router.route('/star/:_id?', {
  name: 'star',
  controller: 'StarController'
});
