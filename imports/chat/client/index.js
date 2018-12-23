import '../chat';
import './chat';

Threads.helpers({
  chat() {
    return Users.findOne(this.params.chat);
  }
});
