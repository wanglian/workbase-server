describe('setup', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/');
		cy.window().then(win => {
			win.Meteor.call("resetDatabase");
		});
  });

  it('should setup and log in the admin', () => {
    cy.contains('Get Started').click();
    cy.get('#step-1 input[name=company]').type('WorkBase');
    cy.get('#step-1 input[name=domain]').type('workbase.org');
		cy.get('#step-1 button.btn-next').click();

		cy.get('#step-2 button.btn-next').click();

		cy.get('#step-3 button.btn-next').click();

    cy.get('#step-4 input[name=name]').type('James');
    cy.get('#step-4 input[name=email]').type('james');
    cy.get('#step-4 input[name=password]').type('james1234');
		cy.get('#step-4 button.btn-next').click();

		cy.wait(2200);
		cy.get('#step-5 button[type=submit]').click();

    cy.get('#login-form input[name=email]').type('james');
    cy.get('#login-form input[name=password]').type('james1234');
		cy.get('#login-form button[type=submit]').click();

		cy.url().should('eq', 'http://localhost:3000/inbox');

    cy.window().then(win => {
      // this allows accessing the window object within the browser
      const user = win.Meteor.user();
      expect(user).to.exist;
      expect(user.name()).to.equal('James');
      expect(user.email()).to.equal('james@workbase.org');
    });
  });
});
