import './home.html';

Template.Home.events({
  "submit form"(e, t) {
    e.preventDefault();
    // history.go(-1);
    console.log("login..");
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