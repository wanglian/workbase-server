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
