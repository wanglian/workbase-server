import '/imports/test/test-helpers';

describe('mailgun api', function() {
  it('should respond to post: /api/v1/mailgun', function() {
    chai.request("http://localhost:3000").post('/api/v1/mailgun').then(function(res) {
      expect(res).to.have.status(200);
    });
  });
});