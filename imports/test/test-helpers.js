import './factories';

import lodash from 'lodash';

faker = require('faker');
sinon = require('sinon');
chai  = require('chai');
chaiHttp = require('chai-http');
chai.use(chaiHttp);
expect = chai.expect;
should = chai.should();
_ = lodash;

// Convert an NPM-style function returning a callback to one that returns a Promise.
denodeify = f => (...args) => new Promise((resolve, reject) => {
  f(...args, (err, val) => {
    if (err) {
      reject(err);
    } else {
      resolve(val);
    }
  });
});