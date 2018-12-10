import './login.html';

Template.Login.events({
  "submit form"(e, t) {
    e.preventDefault();

    let email = $('input[type=email]')[0].value;
    let password = $('input[type=password]')[0].value;
    Meteor.loginWithPassword(email, password, (err) => {
      if (err) {
        console.log(err);
      } else {
        Router.go('/inbox');
      }
    });
  }
});