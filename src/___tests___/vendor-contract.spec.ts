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








import { VendorContract } from '../contracts/vendor.contract';
import { Vendor, VendorShipped, VendorList } from '../models';

describe('VendorContract', () => {

    let contract: VendorContract;
    let ctx: TestContext;

    let sampleVendor : Vendor[] = [];

    beforeEach(() => {
        // Prepare the Contract and Context
        contract = new VendorContract();
        ctx = new TestContext();
        ctx.clientIdentity.getMSPID.returns('Org1MSP');

        // Load the sample data file
        sampleVendor = [{
            "RecordID": "DOES_EXIST",
            "VendorID": "DOES_EXIST",
            "ParentVendorID": "DOES_EXIST",
            "Name": "Home Depot",
            "TenantName": "homedepot",
            "HLFOrganization": "HomeDepotOrg",
            "HLFMemberServicesProvider": "HomeDepotMSP",
            LastUpdatedDate: 12062019
        }] as Vendor[];

        // Add Vendor List record, and record composite key creator
        ctx.stub.createCompositeKey.withArgs('vendor', ['DEFAULT']).returns(' vendor DEFAULT');
        ctx.stub.getPrivateData.withArgs(testPDCName, ' vendor DEFAULT').resolves(Buffer.from(JSON.stringify(new VendorList({ Items: sampleVendor }))));

        // Add all records for the find search
        let iterator : Iterators.StateQueryIterator = {
            close: async () => { return; },
            next: async () => { 
                iterator['currentIndex']++;
                return {
                    value : {
                        key: 'vendor',
                        value: Buffer.from(JSON.stringify(iterator['allItems'][iterator['currentIndex']])),
                        getKey: ()=>'vendor',
                        getValue: ()=>Buffer.from(JSON.stringify(sampleVendor))
                    } as Iterators.KV,
                    done : (iterator['allItems'].length == iterator['currentIndex']+1)
                } as Iterators.NextResult; 
            }
        } as Iterators.StateQueryIterator;

        iterator['allItems'] = sampleVendor;
        iterator['currentIndex'] = -1;

        ctx.stub.getPrivateDataByPartialCompositeKey.withArgs(testPDCName, 'vendor', []).resolves(iterator);
    });

    describe('#saveVendor', () => {

        it('should create a vendor', async () => {
            let newVendor : Vendor = {
                "RecordID": "DOES_NOT_EXIST",
                "VendorID": "DOES_NOT_EXIST",
                "ParentVendorID": "DOES_NOT_EXIST",
                "Name": "New Vendor",
                "TenantName": "bosch",
                "HLFOrganization": "BoschOrg",
                "HLFMemberServicesProvider": "BoschMSP",
                LastUpdatedDate: 12062019
            } as Vendor;

            let resultVendor : Vendor[] = await contract.saveVendor(ctx, [newVendor]);

            let finalVendor : Vendor[] = [];

            finalVendor = [{
                "RecordID": "DOES_EXIST",
                "VendorID": "DOES_EXIST",
                "ParentVendorID": "DOES_EXIST",
                "Name": "Home Depot",
                "TenantName": "homedepot",
                "HLFOrganization": "HomeDepotOrg",
                "HLFMemberServicesProvider": "HomeDepotMSP",
                LastUpdatedDate: 12062019
            },{
                "RecordID": "DOES_NOT_EXIST",
                "VendorID": "DOES_NOT_EXIST",
                "ParentVendorID": "DOES_NOT_EXIST",
                "Name": "New Vendor",
                "TenantName": "bosch",
                "HLFOrganization": "BoschOrg",
                "HLFMemberServicesProvider": "BoschMSP",
                LastUpdatedDate: 12062019
            }] as Vendor[];

            ctx.stub.putPrivateData.should.have.been.calledOnceWithExactly(testPDCName, ' vendor DEFAULT', Buffer.from(JSON.stringify(new VendorList({ Items: finalVendor }))));
            chai.expect(resultVendor).to.deep.equal([newVendor]);
        });

        it('should update a vendor', async () => {
            let updatedVendor : Vendor = {
                RecordID: 'DOES_EXIST',
                VendorID: 'DOES_EXIST',
                ParentVendorID: 'UPDATED_VENDOR_ID',
                Name: 'Updated Vendor',
                TenantName: 'lutron',
                HLFOrganization: 'LutronOrg',
                HLFMemberServicesProvider: 'LutronMSP',
                LastUpdatedDate: 12062019
            } as Vendor;

            let resultVendor : Vendor[] = await contract.saveVendor(ctx, [updatedVendor]);
            ctx.stub.putPrivateData.should.have.been.calledOnceWithExactly(testPDCName, ' vendor DEFAULT', Buffer.from(JSON.stringify(new VendorList({ Items: [updatedVendor] }))));
            chai.expect(resultVendor).to.deep.equal([updatedVendor]);
        });

    });

    describe('#retrieveVendor', () => {
        it('should return all Vendor data', async () => {
            await contract.retrieveVendor(ctx).should.eventually.deep.equal(sampleVendor);
        });
    });


});
