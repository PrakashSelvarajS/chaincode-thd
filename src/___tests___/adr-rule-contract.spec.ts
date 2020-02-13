import { TestHelper, TestContext, testPDCName } from './___test-helper';

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









import { ADRRuleContract } from '..';
import { AssetProcurement, UnitOfMeasure, Discrepancy, DiscrepancyType, StageType, ADRRule, ADRRuleList } from '../models';
import { PurchaseOrderContract } from '../contracts/purchase-order.contract';
import { ChaincodeStub, ClientIdentity, Iterators } from 'fabric-shim';
import { VendorShippedContract } from '../contracts/vendor-shipped.contract';

const objectType : string = ' ap ';
const testconfigSubFolder : string = 'adrRules';

describe('ADRRuleContract', () => {

    let contract: ADRRuleContract;
    let ctx: TestContext;

    let sampleADRs : ADRRule[] = [];

    beforeEach(() => {
        // Prepare Context
        contract = new ADRRuleContract();
        ctx = new TestContext();
        ctx.clientIdentity.getMSPID.returns('Org1MSP');

        // Add each ADR record, and record composite key creator
        sampleADRs = JSON.parse(fs.readFileSync(path.join(__dirname, 'testconfigs', 'ADRTest.json')).toString('utf8'));
        ctx.stub.createCompositeKey.withArgs('adr', ['DEFAULT']).returns(' adr DEFAULT');
        ctx.stub.getPrivateData.withArgs(testPDCName, ' adr DEFAULT').resolves(Buffer.from(JSON.stringify(new ADRRuleList({ Items: sampleADRs }))));

        // Add all records for the find search
        let adrIterator : Iterators.StateQueryIterator = {
            close: async () => { return; },
            next: async () => { 
                adrIterator['currentIndex']++;
                return {
                    value : {
                        key: 'adr',
                        value: Buffer.from(JSON.stringify(adrIterator['allItems'][adrIterator['currentIndex']])),
                        getKey: ()=>'adr',
                        getValue: ()=>Buffer.from(JSON.stringify(sampleADRs))
                    } as Iterators.KV,
                    done : (adrIterator['allItems'].length == adrIterator['currentIndex']+1)
                } as Iterators.NextResult; 
            }
        } as Iterators.StateQueryIterator;

        adrIterator['allItems'] = sampleADRs;
        adrIterator['currentIndex'] = -1;

        ctx.stub.getPrivateDataByPartialCompositeKey.withArgs(testPDCName, 'adr', []).resolves(adrIterator);

    });

    describe('#retrieveADRRules', () => {
        it('BR-ADR-001 should retrieve a list of ADR Rules', async () => {
            await contract.retrieveADRRules(ctx).should.eventually.deep.equal(sampleADRs);
        });
    });

    describe('#saveADRRule', () => {
        it('BR-ADR-002 should merge new ADR Rules into existing rules', async () => {

            let newADRRule: ADRRule = {
                "RuleID" : "BR-ADR-004",
                "Description" : "BR-ADR-001 : PO data is missing",
                "Solution" : "Don't Pay",
                "Conditions" : [
                    {
                        "RuleConditionID" : "", 
                        "RuleID" :  "",  
                        "Description" :  "", 
                        "FactType" : "PurchaseOrderQuantityMatched",
                        "MinimumValue" : 0,  
                        "MinimumComparisonType" : "==",
                        "MaximumValue" : 0,
                        "MaximumComparisonType" : "==",
                        "LastUpdatedDate" : 0
                    }
                ]  
            } as ADRRule;

            //Retrieving the existing ADRlist
            sampleADRs = JSON.parse(fs.readFileSync(path.join(__dirname, 'testconfigs', 'ADRTest.json')).toString('utf8'));

            //ADRlist combining the existing ADR Rule and the new Rule
            sampleADRs.push(newADRRule);

            let resultADRRule : ADRRule[] = await contract.saveADRRules(ctx, [newADRRule]);

            ctx.stub.putPrivateData.should.have.been.calledOnceWithExactly(testPDCName, ' adr DEFAULT', Buffer.from(JSON.stringify(new ADRRuleList({ Items: sampleADRs }))));
            
            chai.expect(resultADRRule).to.deep.equal([newADRRule]);
        });

        it('BR-ADR-003 should replace matching ADR Rules with new rules', async () => {

            let replacingADRRule: ADRRule =  {
                "RuleID" : "BR-ADR-001",
                "Description" : "BR-ADR-001 : Replacing existing ADR rule",
                "Solution" : "Pay",
                "Conditions" : [
                    {
                        "RuleConditionID" : "", 
                        "RuleID" :  "",  
                        "Description" :  "", 
                        "FactType" : "RDCReceivedQuantityMatched",
                        "MinimumValue" : 0,  
                        "MinimumComparisonType" : "==",
                        "MaximumValue" : 0,
                        "MaximumComparisonType" : "==",
                        "LastUpdatedDate" : 0
                    }
                ]  
            } as ADRRule;

            //Retrieving the existing ADRlist
            sampleADRs = JSON.parse(fs.readFileSync(path.join(__dirname, 'testconfigs', 'ADRTest.json')).toString('utf8'));


            //Replacing the existing ADR rule with the new matching ADR rule
            const existingadrindex = sampleADRs.findIndex((v,i,l)=> { return v.RuleID = replacingADRRule.RuleID});
            sampleADRs[existingadrindex] = replacingADRRule;

            let resultADRRule : ADRRule[] = await contract.saveADRRules(ctx, [replacingADRRule]);

            ctx.stub.putPrivateData.should.have.been.calledOnceWithExactly(testPDCName, ' adr DEFAULT', Buffer.from(JSON.stringify(new ADRRuleList({ Items: sampleADRs }))));
            
            chai.expect(resultADRRule).to.deep.equal([replacingADRRule]);

        });
    });

    describe('#saveVendorShipped', () => {
        let vsContract : VendorShippedContract = new VendorShippedContract();

        it('BR-ADR-004 should not pay when PO data is missing', async () => {
            let testConfig = TestHelper.loadAPTestConfig('BR-ADR-004', ctx, testconfigSubFolder);
            let resultAP : AssetProcurement = await vsContract.saveVendorShipped(ctx, testConfig.input.PONumber, testConfig.input.VendorShippeds);
            ctx.stub.putPrivateData.should.have.been.calledOnceWith(testPDCName, objectType + testConfig.input.PONumber, Buffer.from(JSON.stringify(testConfig.output)));
            chai.expect(testConfig.output).to.deep.equal(resultAP);
        });
    });



});