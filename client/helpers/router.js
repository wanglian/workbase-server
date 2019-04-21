Template.registerHelper('inRouter', function(router) {
  return Router.current().route.getName() === router;
});
