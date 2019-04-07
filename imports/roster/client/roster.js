import './roster.html';

Template.Roster.helpers({
  cardTemplate() {
    return this.type === 'Contacts' ? 'ContactCard' : 'RosterCard';
  }
});

Template.RosterMenu.events({
  "click #btn-search"(e, t) {
    e.preventDefault();
    $('.threads .search').toggleClass('hide');
    if (!$('.threads .search').hasClass('hide')) {
      $('.threads .search input').focus();
    }
  }
});

Template.RosterList.onRendered(function() {
  this.autorun(() => {
    let data = Template.currentData();
    $('.threads .thread').removeClass('active');
    if (data.user) {
      $(`.thread#${data.user._id}`).addClass('active');
    }
  });
});

Template.RosterList.helpers({
  rosterPath() {
    let router = Router.current();
    let params = _.extend(router.params, {_id: this._id});
    return router.route.path(params);
  }
});

Template.RosterList.events({
  "keyup li.search input"(e, t) {
    e.preventDefault();
    let keyword = $(e.target).val();
    let router = Router.current();
    let params = _.extend(router.params, {_id: this._id});
    if (keyword) {
      Router.go('roster', {_type: router.params._type}, {query: {search: keyword}});
    } else {
      Router.go('roster', {_type: router.params._type});
    }
  }
});

Template.LinkToEditContact.events({
  "click .btn-edit-contact"(e, t) {
    e.preventDefault();
    Modal.show("EditContactModal", this.contact, {
      backdrop: 'static'
    });
  }
});

Template.LinkToChat.events({
  "click #btn-chat"(e, t) {
    e.preventDefault();

    Meteor.call('startChat', this.roster._id, (err, res) => {
      if (err) {
        console.log(err);
      } else {
        console.log(res);
        $(".modal button[class=close]").click();
        Router.go('inbox', {_id: res});
      }
    });
  }
});

Template.LinkToCardModal.events({
  "click .btn-show-card"(e, t) {
    e.preventDefault();
    e.stopPropagation();
    let modal = this.user.className() === 'Contacts' ? 'ContactCardModal' : 'UserCardModal';
    Modal.show(modal, this.user);
  }
});
