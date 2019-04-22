ThreadActions = {};

ThreadActions.star = {
  title() {
    return I18n.t('thread_action_star');
  },
  icon(thread) {
    return thread.star ? "fa fa-star text-yellow" : "fa fa-star-o";
  },
  action(thread) {
    toggleStarThread.call({threadId: thread._id});
  }
};

ThreadActions.archive = {
  title(thread) {
    return thread.archive ? I18n.t('thread_action_unarchive') : I18n.t('thread_action_archive');
  },
  icon(thread) {
    return thread.archive ? "" : "fa fa-archive";
  },
  action(thread) {
    let count = toggleArchiveThread.call({threadId: thread._id});
    if (count === 1 && !thread.archive) { // 修改前状态
      let router = Router.current();
      Router.go(router.route.getName(), {}, {query: router.params.query});
    }
  }
};

ThreadActions.spam = {
  title(thread) {
    return thread.spam ? I18n.t('thread_action_unspam') : I18n.t('thread_action_spam');
  },
  icon(thread) {
    return thread.spam ? "" : "fa fa-exclamation-triangle";
  },
  action(thread) {
    let count = toggleSpamThread.call({threadId: thread._id});
    if (count === 1 && !thread.spam) { // 修改前状态
      let router = Router.current();
      Router.go(router.route.getName(), {}, {query: router.params.query});
    }
  }
};

ThreadActions.search = {
  title() {
    return I18n.t("search_action");
  },
  icon: "fa fa-search",
  action(thread) {
    Modal.show('ThreadSearchModal', thread, {
      backdrop: 'static'
    });
  }
};

ThreadActions.notes = {
  title() {
    return I18n.t("thread_notes");
  },
  icon: "fa fa-sticky-note-o",
  action(thread) {
    Modal.show('ThreadNotesModal', thread, {
      backdrop: 'static'
    });
  }
};
