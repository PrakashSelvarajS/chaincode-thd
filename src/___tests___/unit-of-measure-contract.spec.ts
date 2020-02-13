import { Context } from 'fabric-contract-api';
import { ChaincodeStub, ClientIdentity, Iterators } from 'fabric-shim';
import { testPDCName } from './___test-helper';

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








import { UnitOfMeasureContract } from '../contracts/unit-of-measure.contract';
import { UnitOfMeasure, UnitOfMeasureList } from '../models';

describe('UnitOfMeasureContract', () => {

    let contract: UnitOfMeasureContract;
    let ctx: TestContext;

    let sampleUOM : UnitOfMeasure[] = [];

    beforeEach(() => {
        // Prepare the Contract and Context
        contract = new UnitOfMeasureContract();
        ctx = new TestContext();
        ctx.clientIdentity.getMSPID.returns('Org1MSP');

        // Load the sample data file
        sampleUOM = [
            {
                "RecordID": "DOES_EXIST",
                "Description": "",
                "SKU": "YYYYYYY",
                "SKUGTIN": "",
                "UnitHeight": 100.00,
                "UnitLength": 200.00,
                "UnitVolume": 300.00,
                "UnitWeight": 400.00,
                "UnitWidth":  500.00,
                "UnitCost": 10,
                "PalletCount": 0,
                "CaseCount": 1,
                "PackCount": 1,
                "EachCount": 3,
                "OtherCount": 0,
                "UpdateDate": 17012020,
                "OrderStandard": "Each"

            }
        ] as UnitOfMeasure[];

        // Add Vendor List record, and record composite key creator
        ctx.stub.createCompositeKey.withArgs('uom', ['DEFAULT']).returns(' uom DEFAULT');
        ctx.stub.getPrivateData.withArgs(testPDCName, ' uom DEFAULT').resolves(Buffer.from(JSON.stringify(new UnitOfMeasureList({ Items: sampleUOM }))));

        // Add all records for the find search
        let iterator : Iterators.StateQueryIterator = {
            close: async () => { return; },
            next: async () => { 
                iterator['currentIndex']++;
                return {
                    value : {
                        key: 'uom',
                        value: Buffer.from(JSON.stringify(iterator['allItems'][iterator['currentIndex']])),
                        getKey: ()=>'uom',
                        getValue: ()=>Buffer.from(JSON.stringify(sampleUOM))
                    } as Iterators.KV,
                    done : (iterator['allItems'].length == iterator['currentIndex']+1)
                } as Iterators.NextResult; 
            }
        } as Iterators.StateQueryIterator;

        iterator['allItems'] = sampleUOM;
        iterator['currentIndex'] = -1;

        ctx.stub.getPrivateDataByPartialCompositeKey.withArgs(testPDCName, 'uom', []).resolves(iterator);
    });

    describe('#saveUnitOfMeasure', () => {

        it('should create a unit of measure', async () => {
            let newUOM : UnitOfMeasure = {
                RecordID: 'DOES_NOT_EXIST',
                Description: '',
                SKU: 'XXXXXXX',
                SKUGTIN: '',
                UnitHeight: 100,
                UnitLength: 200,
                UnitVolume: 300,
                UnitWeight: 400,
                UnitWidth:  500,
                UnitCost: 20,
                PalletCount: 320,
                CaseCount: 4,
                PackCount: 4,
                EachCount: 1,
                OtherCount: 0,
                UpdateDate: 15012020,
                OrderStandard: "Each"
            } as UnitOfMeasure;

            let resultUOM : UnitOfMeasure[] = await contract.saveUnitOfMeasure(ctx, [newUOM]);

            let finalUOM : UnitOfMeasure[] = [];

            finalUOM = [
                {
                    "RecordID": "DOES_EXIST",
                    "Description": "",
                    "SKU": "YYYYYYY",
                    "SKUGTIN": "",
                    "UnitHeight": 100.00,
                    "UnitLength": 200.00,
                    "UnitVolume": 300.00,
                    "UnitWeight": 400.00,
                    "UnitWidth":  500.00,
                    "UnitCost": 10,
                    "PalletCount": 0,
                    "CaseCount": 1,
                    "PackCount": 1,
                    "EachCount": 3,
                    "OtherCount": 0,
                    "UpdateDate": 17012020,
                    "OrderStandard": "Each"
                },
                {
                    "RecordID": "DOES_NOT_EXIST",
                    "Description": "",
                    "SKU": "XXXXXXX",
                    "SKUGTIN": "",
                    "UnitHeight": 100,
                    "UnitLength": 200,
                    "UnitVolume": 300,
                    "UnitWeight": 400,
                    "UnitWidth": 500,
                    "UnitCost": 20,
                    "PalletCount": 320,
                    "CaseCount": 4,
                    "PackCount": 4,
                    "EachCount": 1,
                    "OtherCount": 0,
                    "UpdateDate": 15012020,
                    "OrderStandard": "Each"
                  }
            ] as UnitOfMeasure[];

            ctx.stub.putPrivateData.should.have.been.calledOnceWithExactly(testPDCName, ' uom DEFAULT', Buffer.from(JSON.stringify(new UnitOfMeasureList({ Items: finalUOM }))));
            chai.expect(resultUOM).to.deep.equal([newUOM]);
        });

        it('should update a unit of measure', async () => {
            let updatedUOM : UnitOfMeasure = {
                RecordID: 'DOES_EXIST',
                Description: 'UPDATED DESCRIPTION',
                SKU: 'YYYYYYY',
                SKUGTIN: 'UPDATED SKUGTIN',
                UnitHeight: 111.11,
                UnitLength: 222.22,
                UnitVolume: 333.33,
                UnitWeight: 444.44,
                UnitWidth:  555.55,
                UnitCost: 20,
                PalletCount: 320,
                CaseCount: 4,
                PackCount: 4,
                EachCount: 1,
                OtherCount: 0,
                UpdateDate: 15012020,
                OrderStandard: "Each"
            } as UnitOfMeasure;

            let resultUOM : UnitOfMeasure[] = await contract.saveUnitOfMeasure(ctx, [updatedUOM]);
            ctx.stub.putPrivateData.should.have.been.calledOnceWithExactly(testPDCName, ' uom DEFAULT', Buffer.from(JSON.stringify(new UnitOfMeasureList({ Items: [updatedUOM] }))));
            chai.expect(resultUOM).to.deep.equal([updatedUOM]);
        });

    });

    describe('#retrieveUnitOfMeasure', () => {
        it('should return all UOM data', async () => {
            await contract.retrieveUnitOfMeasure(ctx).should.eventually.deep.equal(sampleUOM);
        });
    });


});
