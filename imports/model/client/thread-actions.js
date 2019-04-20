ThreadActions = {};

ThreadActions.star = {
  title() {
    return I18n.t('Star');
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
    return thread.archive ? I18n.t('Unarchive') : I18n.t('Archive');
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
    return thread.spam ? I18n.t('Not Spam') : I18n.t('Spam');
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
    return I18n.t("Search");
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
    return I18n.t("Notes");
  },
  icon: "fa fa-sticky-note-o",
  action(thread) {
    Modal.show('ThreadNotesModal', thread, {
      backdrop: 'static'
    });
  }
};
