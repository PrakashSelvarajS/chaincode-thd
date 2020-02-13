import { TestHelper, TestContext, testPDCName } from './___test-helper';

import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import winston = require('winston');

chai.should();
chai.use(chaiAsPromised);
chai.use(sinonChai);









import { IFCShippedContract } from '..';
import { IFCShipped, AssetProcurement, UnitOfMeasure, Discrepancy, DiscrepancyType, StageType } from '../models';

const objectType : string = ' ap ';
const testconfigSubFolder : string = 'ifcShipped';

describe('IFCShippedContract', () => {

    let contract: IFCShippedContract;
    let ctx: TestContext;

    beforeEach(() => {
        // Prepare the Contract and Context
        contract = new IFCShippedContract();
        ctx = new TestContext();
    });

    describe('#saveIFCShipped', () => {

        it('BR-ISH-001 should create a procurement record for new poNumbers', async () => {
            let testConfig = TestHelper.loadAPTestConfig('BR-ISH-001', ctx, testconfigSubFolder);
            let resultAP : AssetProcurement = await contract.saveIFCShipped(ctx, testConfig.input.PONumber, testConfig.input.IFCShippeds);
            ctx.stub.putPrivateData.should.have.been.calledOnceWith(testPDCName, objectType + testConfig.input.PONumber, Buffer.from(JSON.stringify(testConfig.output)));
            chai.expect(testConfig.output).to.deep.equal(resultAP);
        });

        it('BR-ISH-002 should add unique new IFC Shipped data into previous imported data', async () => {
            let testConfig = TestHelper.loadAPTestConfig('BR-ISH-002', ctx, testconfigSubFolder);
            let resultAP : AssetProcurement = await contract.saveIFCShipped(ctx, testConfig.input.PONumber, testConfig.input.IFCShippeds);
            ctx.stub.putPrivateData.should.have.been.calledOnceWith(testPDCName, objectType + testConfig.input.PONumber, Buffer.from(JSON.stringify(testConfig.output)));
            chai.expect(testConfig.output).to.deep.equal(resultAP);
        });

        it('BR-ISH-003 should replace matching, existing IFC Shipped data with new imported data', async () => {
            let testConfig = TestHelper.loadAPTestConfig('BR-ISH-003', ctx, testconfigSubFolder);
            let resultAP : AssetProcurement = await contract.saveIFCShipped(ctx, testConfig.input.PONumber, testConfig.input.IFCShippeds);
            ctx.stub.putPrivateData.should.have.been.calledOnceWith(testPDCName, objectType + testConfig.input.PONumber, Buffer.from(JSON.stringify(testConfig.output)));
            chai.expect(testConfig.output).to.deep.equal(resultAP);
        });

        it('BR-ISH-004 should uniquely identify IFC Shipped data for matching new data with existing data', async () => {
            let testConfig = TestHelper.loadAPTestConfig('BR-ISH-004', ctx, testconfigSubFolder);
            let resultAP : AssetProcurement = await contract.saveIFCShipped(ctx, testConfig.input.PONumber, testConfig.input.IFCShippeds);
            ctx.stub.putPrivateData.should.have.been.calledOnceWith(testPDCName, objectType + testConfig.input.PONumber, Buffer.from(JSON.stringify(testConfig.output)));
            chai.expect(testConfig.output).to.deep.equal(resultAP);
        });

        it('BR-ISH-005 should aggregate Quantity of a SKU destined for the same RDC, when determining Shortage / Overage', async () => {
            let testConfig = TestHelper.loadAPTestConfig('BR-ISH-005', ctx, testconfigSubFolder);
            let resultAP : AssetProcurement = await contract.saveIFCShipped(ctx, testConfig.input.PONumber, testConfig.input.IFCShippeds);
            ctx.stub.putPrivateData.should.have.been.calledOnceWith(testPDCName, objectType + testConfig.input.PONumber, Buffer.from(JSON.stringify(testConfig.output)));
            chai.expect(testConfig.output).to.deep.equal(resultAP);
        });

        it('BR-ISH-006 should flag when the Purchase Order data is missing for this PO Number (Missing PO)', async () => {
            let testConfig = TestHelper.loadAPTestConfig('BR-ISH-006', ctx, testconfigSubFolder);
            let resultAP : AssetProcurement = await contract.saveIFCShipped(ctx, testConfig.input.PONumber, testConfig.input.IFCShippeds);
            ctx.stub.putPrivateData.should.have.been.calledOnceWith(testPDCName, objectType + testConfig.input.PONumber, Buffer.from(JSON.stringify(testConfig.output)));
            chai.expect(testConfig.output).to.deep.equal(resultAP);
        });

        it('BR-ISH-007 should flag when the Vendor Shipped data is missing for this PO Number (Missing Vendor Shipped)', async () => {
            let testConfig = TestHelper.loadAPTestConfig('BR-ISH-007', ctx, testconfigSubFolder);
            let resultAP : AssetProcurement = await contract.saveIFCShipped(ctx, testConfig.input.PONumber, testConfig.input.IFCShippeds);
            ctx.stub.putPrivateData.should.have.been.calledOnceWith(testPDCName, objectType + testConfig.input.PONumber, Buffer.from(JSON.stringify(testConfig.output)));
            chai.expect(testConfig.output).to.deep.equal(resultAP);
        });

        it('BR-ISH-008 should flag when the IFC shipped a SKU from Vendor that was not on the PO (Wrong SKU)', async () => {
            let testConfig = TestHelper.loadAPTestConfig('BR-ISH-008', ctx, testconfigSubFolder);
            let resultAP : AssetProcurement = await contract.saveIFCShipped(ctx, testConfig.input.PONumber, testConfig.input.IFCShippeds);
            ctx.stub.putPrivateData.should.have.been.calledOnceWith(testPDCName, objectType + testConfig.input.PONumber, Buffer.from(JSON.stringify(testConfig.output)));
            chai.expect(testConfig.output).to.deep.equal(resultAP);
        });

        it('BR-ISH-009 should flag when the IFC shipped a SKU destined for an RDC different from PO (Wrong RDC)', async () => {
            let testConfig = TestHelper.loadAPTestConfig('BR-ISH-009', ctx, testconfigSubFolder);
            let resultAP : AssetProcurement = await contract.saveIFCShipped(ctx, testConfig.input.PONumber, testConfig.input.IFCShippeds);
            ctx.stub.putPrivateData.should.have.been.calledOnceWith(testPDCName, objectType + testConfig.input.PONumber, Buffer.from(JSON.stringify(testConfig.output)));
            chai.expect(testConfig.output).to.deep.equal(resultAP);
        });

        it('BR-ISH-010 should flag when the IFC shipped less SKU Quantity from Vendor than Vendor Shipped (Shortage)', async () => {
            let testConfig = TestHelper.loadAPTestConfig('BR-ISH-010', ctx, testconfigSubFolder);
            let resultAP : AssetProcurement = await contract.saveIFCShipped(ctx, testConfig.input.PONumber, testConfig.input.IFCShippeds);
            ctx.stub.putPrivateData.should.have.been.calledOnceWith(testPDCName, objectType + testConfig.input.PONumber, Buffer.from(JSON.stringify(testConfig.output)));
            chai.expect(testConfig.output).to.deep.equal(resultAP);
        });

        it('BR-ISH-011 should flag when the IFC shipped more SKU Quantity from Vendor than Vendor Shipped (Overage)', async () => {
            let testConfig = TestHelper.loadAPTestConfig('BR-ISH-011', ctx, testconfigSubFolder);
            let resultAP : AssetProcurement = await contract.saveIFCShipped(ctx, testConfig.input.PONumber, testConfig.input.IFCShippeds);
            ctx.stub.putPrivateData.should.have.been.calledOnceWith(testPDCName, objectType + testConfig.input.PONumber, Buffer.from(JSON.stringify(testConfig.output)));
            chai.expect(testConfig.output).to.deep.equal(resultAP);
        });

    });

});

