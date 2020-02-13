import { Context } from 'fabric-contract-api';
import { ChaincodeStub, ClientIdentity, Iterators } from 'fabric-shim';
import { AssetProcurement, UnitOfMeasureList, ADRRuleList } from "../models";
import * as fs from 'fs';
import * as path from 'path';

import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import winston = require('winston');

export class APTestConfig {
    public input: AssetProcurement;
    public output: AssetProcurement;
    public existingAPs?: AssetProcurement[];
    public existingUOMs?: UnitOfMeasureList;
    public existingADRs?: ADRRuleList;

    constructor(init?:Partial<APTestConfig>) {
        Object.assign(this, init);
    }
}

chai.should();
chai.use(chaiAsPromised);
chai.use(sinonChai);

export class TestContext implements Context {
    public stub: sinon.SinonStubbedInstance<ChaincodeStub> = sinon.createStubInstance(ChaincodeStub);
    public clientIdentity: sinon.SinonStubbedInstance<ClientIdentity> = sinon.createStubInstance(ClientIdentity);
    public logging = {
        getLogger: sinon.stub().returns(sinon.createStubInstance(winston.createLogger().constructor)),
        setLevel: sinon.stub(),
     };
}


export let testPDCName : string = 'collection_Org1MSP';


export class TestHelper {

    constructor() {}

    public static loadAPTestConfig(testID : string, ctx : TestContext, subfolder? : string | undefined) : APTestConfig {
        ctx.clientIdentity.getMSPID.returns('Org1MSP');

        let testFilePath : string = (subfolder === undefined) ? path.join(__dirname, 'testconfigs', testID+'.json') : path.join(__dirname, 'testconfigs', subfolder, testID+'.json');
        let basicTestConfig : any = JSON.parse(fs.readFileSync(testFilePath).toString('utf8'));
        let testConfig : APTestConfig = new APTestConfig();
        testConfig.input = new AssetProcurement(basicTestConfig.input);
        testConfig.output = new AssetProcurement(basicTestConfig.output);

        if (basicTestConfig.existingUOMs === undefined) {
            testConfig.existingUOMs = new UnitOfMeasureList({ Items: JSON.parse(fs.readFileSync(path.join(__dirname, 'testconfigs', 'UOM.json')).toString('utf8')) });
        } else {
            testConfig.existingUOMs = new UnitOfMeasureList({ Items: basicTestConfig.existingUOMs });
        }
        if (basicTestConfig.existingAPs === undefined) {
            testConfig.existingAPs = JSON.parse(fs.readFileSync(path.join(__dirname, 'testconfigs', 'AP.json')).toString('utf8'));
        } else {
            testConfig.existingAPs = basicTestConfig.existingAPs;
        }
        if (basicTestConfig.existingADRs === undefined) {
            testConfig.existingADRs = new ADRRuleList({ Items: JSON.parse(fs.readFileSync(path.join(__dirname, 'testconfigs', 'ADR.json')).toString('utf8')) });
        } else {
            testConfig.existingADRs = new ADRRuleList({ Items: basicTestConfig.existingADRs });
        }
 
        // Add the UOM List record, and record composite key creator
        ctx.stub.createCompositeKey.withArgs('uom', ['DEFAULT']).returns(' uom DEFAULT');
        ctx.stub.getPrivateData.withArgs(testPDCName, ' uom DEFAULT').resolves(Buffer.from(JSON.stringify(testConfig.existingUOMs)));

        // Add each AP record, and record composite key creator
        for (let ap of testConfig.existingAPs) {
            ctx.stub.createCompositeKey.withArgs('ap', [ap.PONumber]).returns(' ap '+ap.PONumber);
            ctx.stub.getPrivateData.withArgs(testPDCName, ' ap '+ap.PONumber).resolves(Buffer.from(JSON.stringify(ap)));
        }

        // Add all records for the find search
        let apIterator : Iterators.StateQueryIterator = {
            close: async () => { return; },
            next: async () => { 
                apIterator['currentIndex']++;
                return {
                    value : {
                        key: 'ap',
                        value: Buffer.from(JSON.stringify(apIterator['allItems'][apIterator['currentIndex']])),
                        getKey: ()=>'ap',
                        getValue: ()=>Buffer.from(JSON.stringify(testConfig.existingAPs))
                    } as Iterators.KV,
                    done : (apIterator['allItems'].length == apIterator['currentIndex']+1)
                } as Iterators.NextResult; 
            }
        } as Iterators.StateQueryIterator;

        apIterator['allItems'] = testConfig.existingAPs;
        apIterator['currentIndex'] = -1;

        ctx.stub.getPrivateDataByPartialCompositeKey.withArgs(testPDCName, 'ap', []).resolves(apIterator);

        // Add the ADR Rule List record, and record composite key creator
        ctx.stub.createCompositeKey.withArgs('adr', ['DEFAULT']).returns(' adr DEFAULT');
        ctx.stub.getPrivateData.withArgs(testPDCName, ' adr DEFAULT').resolves(Buffer.from(JSON.stringify(testConfig.existingADRs)));

        // Add the null record
        ctx.stub.createCompositeKey.withArgs('ap', ['DOES_NOT_EXIST']).returns(' ap DOES_NOT_EXIST');
        ctx.stub.getPrivateData.withArgs(testPDCName, ' ap DOES_NOT_EXIST').resolves(Buffer.from(''));


        return testConfig;
    }

}