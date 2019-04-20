import './instance';
import './users';
import './threads';
import './thread-users';
import './messages';
import './contacts';
import './methods';

clientOnly = () => {
  if (!Meteor.isClient) {
    throw Error("This method is client only!");
  }
};
