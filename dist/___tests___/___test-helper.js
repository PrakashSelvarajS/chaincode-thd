"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fabric_shim_1 = require("fabric-shim");
const models_1 = require("../models");
const fs = require("fs");
const path = require("path");
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
const winston = require("winston");
class APTestConfig {
    constructor(init) {
        Object.assign(this, init);
    }
}
exports.APTestConfig = APTestConfig;
chai.should();
chai.use(chaiAsPromised);
chai.use(sinonChai);
class TestContext {
    constructor() {
        this.stub = sinon.createStubInstance(fabric_shim_1.ChaincodeStub);
        this.clientIdentity = sinon.createStubInstance(fabric_shim_1.ClientIdentity);
        this.logging = {
            getLogger: sinon.stub().returns(sinon.createStubInstance(winston.createLogger().constructor)),
            setLevel: sinon.stub(),
        };
    }
}
exports.TestContext = TestContext;
exports.testPDCName = 'collection_Org1MSP';
class TestHelper {
    constructor() { }
    static loadAPTestConfig(testID, ctx, subfolder) {
        ctx.clientIdentity.getMSPID.returns('Org1MSP');
        let testFilePath = (subfolder === undefined) ? path.join(__dirname, 'testconfigs', testID + '.json') : path.join(__dirname, 'testconfigs', subfolder, testID + '.json');
        let basicTestConfig = JSON.parse(fs.readFileSync(testFilePath).toString('utf8'));
        let testConfig = new APTestConfig();
        testConfig.input = new models_1.AssetProcurement(basicTestConfig.input);
        testConfig.output = new models_1.AssetProcurement(basicTestConfig.output);
        if (basicTestConfig.existingUOMs === undefined) {
            testConfig.existingUOMs = new models_1.UnitOfMeasureList({ Items: JSON.parse(fs.readFileSync(path.join(__dirname, 'testconfigs', 'UOM.json')).toString('utf8')) });
        }
        else {
            testConfig.existingUOMs = new models_1.UnitOfMeasureList({ Items: basicTestConfig.existingUOMs });
        }
        if (basicTestConfig.existingAPs === undefined) {
            testConfig.existingAPs = JSON.parse(fs.readFileSync(path.join(__dirname, 'testconfigs', 'AP.json')).toString('utf8'));
        }
        else {
            testConfig.existingAPs = basicTestConfig.existingAPs;
        }
        if (basicTestConfig.existingADRs === undefined) {
            testConfig.existingADRs = new models_1.ADRRuleList({ Items: JSON.parse(fs.readFileSync(path.join(__dirname, 'testconfigs', 'ADR.json')).toString('utf8')) });
        }
        else {
            testConfig.existingADRs = new models_1.ADRRuleList({ Items: basicTestConfig.existingADRs });
        }
        // Add the UOM List record, and record composite key creator
        ctx.stub.createCompositeKey.withArgs('uom', ['DEFAULT']).returns(' uom DEFAULT');
        ctx.stub.getPrivateData.withArgs(exports.testPDCName, ' uom DEFAULT').resolves(Buffer.from(JSON.stringify(testConfig.existingUOMs)));
        // Add each AP record, and record composite key creator
        for (let ap of testConfig.existingAPs) {
            ctx.stub.createCompositeKey.withArgs('ap', [ap.PONumber]).returns(' ap ' + ap.PONumber);
            ctx.stub.getPrivateData.withArgs(exports.testPDCName, ' ap ' + ap.PONumber).resolves(Buffer.from(JSON.stringify(ap)));
        }
        // Add all records for the find search
        let apIterator = {
            close: async () => { return; },
            next: async () => {
                apIterator['currentIndex']++;
                return {
                    value: {
                        key: 'ap',
                        value: Buffer.from(JSON.stringify(apIterator['allItems'][apIterator['currentIndex']])),
                        getKey: () => 'ap',
                        getValue: () => Buffer.from(JSON.stringify(testConfig.existingAPs))
                    },
                    done: (apIterator['allItems'].length == apIterator['currentIndex'] + 1)
                };
            }
        };
        apIterator['allItems'] = testConfig.existingAPs;
        apIterator['currentIndex'] = -1;
        ctx.stub.getPrivateDataByPartialCompositeKey.withArgs(exports.testPDCName, 'ap', []).resolves(apIterator);
        // Add the ADR Rule List record, and record composite key creator
        ctx.stub.createCompositeKey.withArgs('adr', ['DEFAULT']).returns(' adr DEFAULT');
        ctx.stub.getPrivateData.withArgs(exports.testPDCName, ' adr DEFAULT').resolves(Buffer.from(JSON.stringify(testConfig.existingADRs)));
        // Add the null record
        ctx.stub.createCompositeKey.withArgs('ap', ['DOES_NOT_EXIST']).returns(' ap DOES_NOT_EXIST');
        ctx.stub.getPrivateData.withArgs(exports.testPDCName, ' ap DOES_NOT_EXIST').resolves(Buffer.from(''));
        return testConfig;
    }
}
exports.TestHelper = TestHelper;
//# sourceMappingURL=___test-helper.js.map