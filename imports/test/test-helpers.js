import chai from 'chai';
import lodash from 'lodash';

expect = chai.expect;
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