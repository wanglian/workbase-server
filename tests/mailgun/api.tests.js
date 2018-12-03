let chai = require('chai');
let chaiHttp = require('chai-http');

chai.use(chaiHttp);

let expect = chai.expect;

describe('mailgun router api', function () {
  it('only respond :post', function () {
    chai.request("http://localhost:3000").post('/api/v1/mailgun').then(function(res) {
      expect(res).to.have.status(200);
    });
  })
})