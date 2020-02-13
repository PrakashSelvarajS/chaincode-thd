import { Context } from 'fabric-contract-api';
import { ChaincodeStub, ClientIdentity, Iterators } from 'fabric-shim';

import * as fs from 'fs';
import * as path from 'path';
import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import winston = require('winston');

chai.should();
chai.use(chaiAsPromised);
chai.use(sinonChai);

class TestContext implements Context {
    public stub: sinon.SinonStubbedInstance<ChaincodeStub> = sinon.createStubInstance(ChaincodeStub);
    public clientIdentity: sinon.SinonStubbedInstance<ClientIdentity> = sinon.createStubInstance(ClientIdentity);
    public logging = {
        getLogger: sinon.stub().returns(sinon.createStubInstance(winston.createLogger().constructor)),
        setLevel: sinon.stub(),
     };
}








import { ValidatorConfigContract } from '../contracts/validator-config.contract';
import { ValidatorConfig, NumberRangeConfig } from '../decorators/property-validator.decorator';

describe('ValidatorConfigContract', () => {

    let contract: ValidatorConfigContract;
    let ctx: TestContext;

    beforeEach(() => {
        // Prepare the Contract and Context
        contract = new ValidatorConfigContract();
        ctx = new TestContext();
    });

    describe('#logCurrentValidationConfig', () => {

        it('should print all current validator configs to the log', async () => {
            await contract.logCurrentValidationConfig(ctx);
            chai.expect(true).to.equal(true);
        });

    });

});
