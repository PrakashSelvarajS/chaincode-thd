import { TestHelper, TestContext, testPDCName } from './___test-helper';

import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import winston = require('winston');

chai.should();
chai.use(chaiAsPromised);
chai.use(sinonChai);









import { VendorShippedContract } from '..';
import { VendorShipped, AssetProcurement, UnitOfMeasure, Discrepancy, DiscrepancyType, StageType } from '../models';

const objectType : string = ' ap ';
const testconfigSubFolder : string = 'vendorShipped';

describe('VendorShippedContract', () => {

    let contract: VendorShippedContract;
    let ctx: TestContext;

    beforeEach(() => {
        // Prepare the Contract and Context
        contract = new VendorShippedContract();
        ctx = new TestContext();
    });

    describe('#saveVendorShipped', () => {

        it('BR-VS-001 should create a procurement record for new poNumbers', async () => {
            let testConfig = TestHelper.loadAPTestConfig('BR-VS-001', ctx, testconfigSubFolder);
            let resultAP : AssetProcurement = await contract.saveVendorShipped(ctx, testConfig.input.PONumber, testConfig.input.VendorShippeds);
            ctx.stub.putPrivateData.should.have.been.calledOnceWith(testPDCName, objectType + testConfig.input.PONumber, Buffer.from(JSON.stringify(testConfig.output)));
            chai.expect(testConfig.output).to.deep.equal(resultAP);
        });

        it('BR-VS-002 should add unique new Vendor Shipped data into previous imported data', async () => {
            let testConfig = TestHelper.loadAPTestConfig('BR-VS-002', ctx, testconfigSubFolder);
            let resultAP : AssetProcurement = await contract.saveVendorShipped(ctx, testConfig.input.PONumber, testConfig.input.VendorShippeds);
            ctx.stub.putPrivateData.should.have.been.calledOnceWith(testPDCName, objectType + testConfig.input.PONumber, Buffer.from(JSON.stringify(testConfig.output)));
            chai.expect(testConfig.output).to.deep.equal(resultAP);
        });

        it('BR-VS-003 should replace matching, existing Vendor Shipped data with new imported data', async () => {
            let testConfig = TestHelper.loadAPTestConfig('BR-VS-003', ctx, testconfigSubFolder);
            let resultAP : AssetProcurement = await contract.saveVendorShipped(ctx, testConfig.input.PONumber, testConfig.input.VendorShippeds);
            ctx.stub.putPrivateData.should.have.been.calledOnceWith(testPDCName, objectType + testConfig.input.PONumber, Buffer.from(JSON.stringify(testConfig.output)));
            chai.expect(testConfig.output).to.deep.equal(resultAP);
        });

        it('BR-VS-004 should uniquely identify Vendor Shipped data for matching new data with existing data', async () => {
            let testConfig = TestHelper.loadAPTestConfig('BR-VS-004', ctx, testconfigSubFolder);
            let resultAP : AssetProcurement = await contract.saveVendorShipped(ctx, testConfig.input.PONumber, testConfig.input.VendorShippeds);
            ctx.stub.putPrivateData.should.have.been.calledOnceWith(testPDCName, objectType + testConfig.input.PONumber, Buffer.from(JSON.stringify(testConfig.output)));
            chai.expect(testConfig.output).to.deep.equal(resultAP);
        });

        it('BR-VS-005 should aggregate Quantity of a SKU on the same UCC128, destined for the same RDC', async () => {
            let testConfig = TestHelper.loadAPTestConfig('BR-VS-005', ctx, testconfigSubFolder);
            let resultAP : AssetProcurement = await contract.saveVendorShipped(ctx, testConfig.input.PONumber, testConfig.input.VendorShippeds);
            ctx.stub.putPrivateData.should.have.been.calledOnceWith(testPDCName, objectType + testConfig.input.PONumber, Buffer.from(JSON.stringify(testConfig.output)));
            chai.expect(testConfig.output).to.deep.equal(resultAP);
        });

        it('BR-VS-006 should flag when the PurchaseOrder data is missing for this PO Number (Missing PO)', async () => {
            let testConfig = TestHelper.loadAPTestConfig('BR-VS-006', ctx, testconfigSubFolder);
            let resultAP : AssetProcurement = await contract.saveVendorShipped(ctx, testConfig.input.PONumber, testConfig.input.VendorShippeds);
            ctx.stub.putPrivateData.should.have.been.calledOnceWith(testPDCName, objectType + testConfig.input.PONumber, Buffer.from(JSON.stringify(testConfig.output)));
            chai.expect(testConfig.output).to.deep.equal(resultAP);
        });

        it('BR-VS-007 should flag when the Vendor shipped a SKU that was not on the PO (Wrong SKU)', async () => {
            let testConfig = TestHelper.loadAPTestConfig('BR-VS-007', ctx, testconfigSubFolder);
            let resultAP : AssetProcurement = await contract.saveVendorShipped(ctx, testConfig.input.PONumber, testConfig.input.VendorShippeds);
            ctx.stub.putPrivateData.should.have.been.calledOnceWith(testPDCName, objectType + testConfig.input.PONumber, Buffer.from(JSON.stringify(testConfig.output)));
            chai.expect(testConfig.output).to.deep.equal(resultAP);
        });

        it('BR-VS-008 should flag when the Vendor shipped an item that does not include a SKU (Blank SKU at Vendor Shipped)', async () => {
            let testConfig = TestHelper.loadAPTestConfig('BR-VS-008', ctx, testconfigSubFolder);
            let resultAP : AssetProcurement = await contract.saveVendorShipped(ctx, testConfig.input.PONumber, testConfig.input.VendorShippeds);
            ctx.stub.putPrivateData.should.have.been.calledOnceWith(testPDCName, objectType + testConfig.input.PONumber, Buffer.from(JSON.stringify(testConfig.output)));
            chai.expect(testConfig.output).to.deep.equal(resultAP);
        });

        it('BR-VS-009 should flag when the Vendor specified a SKU destined for an RDC different from PO (Wrong RDC)', async () => {
            let testConfig = TestHelper.loadAPTestConfig('BR-VS-009', ctx, testconfigSubFolder);
            let resultAP : AssetProcurement = await contract.saveVendorShipped(ctx, testConfig.input.PONumber, testConfig.input.VendorShippeds);
            ctx.stub.putPrivateData.should.have.been.calledOnceWith(testPDCName, objectType + testConfig.input.PONumber, Buffer.from(JSON.stringify(testConfig.output)));
            chai.expect(testConfig.output).to.deep.equal(resultAP);
        });

        it('BR-VS-010 should flag when the Vendor shipped less SKU Quantity than PO (Fill Shortage)', async () => {
            let testConfig = TestHelper.loadAPTestConfig('BR-VS-010', ctx, testconfigSubFolder);
            let resultAP : AssetProcurement = await contract.saveVendorShipped(ctx, testConfig.input.PONumber, testConfig.input.VendorShippeds);
            ctx.stub.putPrivateData.should.have.been.calledOnceWith(testPDCName, objectType + testConfig.input.PONumber, Buffer.from(JSON.stringify(testConfig.output)));
            chai.expect(testConfig.output).to.deep.equal(resultAP);
        });

        it('BR-VS-011 should flag when the Vendor shipped more  SKU Quantity than PO (Fill Overage)', async () => {
            let testConfig = TestHelper.loadAPTestConfig('BR-VS-011', ctx, testconfigSubFolder);
            let resultAP : AssetProcurement = await contract.saveVendorShipped(ctx, testConfig.input.PONumber, testConfig.input.VendorShippeds);
            ctx.stub.putPrivateData.should.have.been.calledOnceWith(testPDCName, objectType + testConfig.input.PONumber, Buffer.from(JSON.stringify(testConfig.output)));
            chai.expect(testConfig.output).to.deep.equal(resultAP);
        });


    });

});

