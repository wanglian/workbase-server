import './instance';
import './log-types';
import './users';
import './threads';
import './thread-users';
import './messages';
import './contacts';
import './methods';
import './thread-actions';

clientOnly = () => {
  if (!Meteor.isClient) {
    throw Error("This method is client only!");
  }
};
