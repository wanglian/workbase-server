import './email-input.html';

Template.afEmailInput.helpers({
  atts() {
    var atts = _.clone(this.atts);
    // Add bootstrap class
    atts = AutoForm.Utility.addClass(atts, 'form-control');
    return atts;
  },
  valueWithoutDomain() {
    return this.value.replace(`@${this.atts.domain}`, '');
  }
});

AutoForm.addInputType('emailInput', {
  template: 'afEmailInput',
  valueOut() {
    let domain = this.attr('domain');
    return domain ? `${this.val()}@${domain}` : this.val();
  }
});