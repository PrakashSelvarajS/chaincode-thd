import { TestHelper, TestContext, testPDCName } from './___test-helper';

import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import winston = require('winston');

chai.should();
chai.use(chaiAsPromised);
chai.use(sinonChai);









import { IFCReceivedContract } from '..';
import { IFCReceived, AssetProcurement, UnitOfMeasure, Discrepancy, DiscrepancyType, StageType } from '../models';

const objectType : string = ' ap ';
const testconfigSubFolder : string = 'ifcReceived';

describe('IFCReceivedContract', () => {

    let contract: IFCReceivedContract;
    let ctx: TestContext;

    beforeEach(() => {
        // Prepare the Contract and Context
        contract = new IFCReceivedContract();
        ctx = new TestContext();
    });

    describe('#saveIFCReceived', () => {

        it('BR-IR-001 should create a procurement record for new poNumbers', async () => {
            let testConfig = TestHelper.loadAPTestConfig('BR-IR-001', ctx, testconfigSubFolder);
            let resultAP : AssetProcurement = await contract.saveIFCReceived(ctx, testConfig.input.PONumber, testConfig.input.IFCReceiveds);
            ctx.stub.putPrivateData.should.have.been.calledOnceWith(testPDCName, objectType + testConfig.input.PONumber, Buffer.from(JSON.stringify(testConfig.output)));
            chai.expect(testConfig.output).to.deep.equal(resultAP);
        });

        it('BR-IR-002 should add unique new IFC Received data into previous imported data', async () => {
            let testConfig = TestHelper.loadAPTestConfig('BR-IR-002', ctx, testconfigSubFolder);
            let resultAP : AssetProcurement = await contract.saveIFCReceived(ctx, testConfig.input.PONumber, testConfig.input.IFCReceiveds);
            ctx.stub.putPrivateData.should.have.been.calledOnceWith(testPDCName, objectType + testConfig.input.PONumber, Buffer.from(JSON.stringify(testConfig.output)));
            chai.expect(testConfig.output).to.deep.equal(resultAP);
        });

        it('BR-IR-003 should replace matching, existing IFC Received data with new imported data', async () => {
            let testConfig = TestHelper.loadAPTestConfig('BR-IR-003', ctx, testconfigSubFolder);
            let resultAP : AssetProcurement = await contract.saveIFCReceived(ctx, testConfig.input.PONumber, testConfig.input.IFCReceiveds);
            ctx.stub.putPrivateData.should.have.been.calledOnceWith(testPDCName, objectType + testConfig.input.PONumber, Buffer.from(JSON.stringify(testConfig.output)));
            chai.expect(testConfig.output).to.deep.equal(resultAP);
        });

        it('BR-IR-004 should uniquely identify IFC Received data for matching new data with existing data', async () => {
            let testConfig = TestHelper.loadAPTestConfig('BR-IR-004', ctx, testconfigSubFolder);
            let resultAP : AssetProcurement = await contract.saveIFCReceived(ctx, testConfig.input.PONumber, testConfig.input.IFCReceiveds);
            ctx.stub.putPrivateData.should.have.been.calledOnceWith(testPDCName, objectType + testConfig.input.PONumber, Buffer.from(JSON.stringify(testConfig.output)));
            chai.expect(testConfig.output).to.deep.equal(resultAP);
        });

        it('BR-IR-005 should aggregate Quantity of a SKU on the same UCC128, destined for the same RDC', async () => {
            let testConfig = TestHelper.loadAPTestConfig('BR-IR-005', ctx, testconfigSubFolder);
            let resultAP : AssetProcurement = await contract.saveIFCReceived(ctx, testConfig.input.PONumber, testConfig.input.IFCReceiveds);
            ctx.stub.putPrivateData.should.have.been.calledOnceWith(testPDCName, objectType + testConfig.input.PONumber, Buffer.from(JSON.stringify(testConfig.output)));
            chai.expect(testConfig.output).to.deep.equal(resultAP);
        });

        it('BR-IR-006 should flag when the PurchaseOrder data is missing for this PO Number (Missing PO)', async () => {
            let testConfig = TestHelper.loadAPTestConfig('BR-IR-006', ctx, testconfigSubFolder);
            let resultAP : AssetProcurement = await contract.saveIFCReceived(ctx, testConfig.input.PONumber, testConfig.input.IFCReceiveds);
            ctx.stub.putPrivateData.should.have.been.calledOnceWith(testPDCName, objectType + testConfig.input.PONumber, Buffer.from(JSON.stringify(testConfig.output)));
            chai.expect(testConfig.output).to.deep.equal(resultAP);
        });

        it('BR-IR-007 should flag when the Vendor Shipped data is missing for this PO Number (Missing Vendor Shipped)', async () => {
            let testConfig = TestHelper.loadAPTestConfig('BR-IR-007', ctx, testconfigSubFolder);
            let resultAP : AssetProcurement = await contract.saveIFCReceived(ctx, testConfig.input.PONumber, testConfig.input.IFCReceiveds);
            ctx.stub.putPrivateData.should.have.been.calledOnceWith(testPDCName, objectType + testConfig.input.PONumber, Buffer.from(JSON.stringify(testConfig.output)));
            chai.expect(testConfig.output).to.deep.equal(resultAP);
        });

        it('BR-IR-008 should flag when the IFC received a SKU from Vendor that was not on the PO (Wrong SKU)', async () => {
            let testConfig = TestHelper.loadAPTestConfig('BR-IR-008', ctx, testconfigSubFolder);
            let resultAP : AssetProcurement = await contract.saveIFCReceived(ctx, testConfig.input.PONumber, testConfig.input.IFCReceiveds);
            ctx.stub.putPrivateData.should.have.been.calledOnceWith(testPDCName, objectType + testConfig.input.PONumber, Buffer.from(JSON.stringify(testConfig.output)));
            chai.expect(testConfig.output).to.deep.equal(resultAP);
        });

        it('BR-IR-009 should flag when the IFC received a SKU destined for an RDC different from PO (Wrong RDC)', async () => {
            let testConfig = TestHelper.loadAPTestConfig('BR-IR-009', ctx, testconfigSubFolder);
            let resultAP : AssetProcurement = await contract.saveIFCReceived(ctx, testConfig.input.PONumber, testConfig.input.IFCReceiveds);
            ctx.stub.putPrivateData.should.have.been.calledOnceWith(testPDCName, objectType + testConfig.input.PONumber, Buffer.from(JSON.stringify(testConfig.output)));
            chai.expect(testConfig.output).to.deep.equal(resultAP);
        });

        it('BR-IR-010 should flag when the IFC received less SKU Quantity from Vendor than Vendor Shipped (Shortage)', async () => {
            let testConfig = TestHelper.loadAPTestConfig('BR-IR-010', ctx, testconfigSubFolder);
            let resultAP : AssetProcurement = await contract.saveIFCReceived(ctx, testConfig.input.PONumber, testConfig.input.IFCReceiveds);
            ctx.stub.putPrivateData.should.have.been.calledOnceWith(testPDCName, objectType + testConfig.input.PONumber, Buffer.from(JSON.stringify(testConfig.output)));
            chai.expect(testConfig.output).to.deep.equal(resultAP);
        });

        it('BR-IR-011 should flag when the IFC received more SKU Quantity from Vendor than Vendor Shipped (Overage)', async () => {
            let testConfig = TestHelper.loadAPTestConfig('BR-IR-011', ctx, testconfigSubFolder);
            let resultAP : AssetProcurement = await contract.saveIFCReceived(ctx, testConfig.input.PONumber, testConfig.input.IFCReceiveds);
            ctx.stub.putPrivateData.should.have.been.calledOnceWith(testPDCName, objectType + testConfig.input.PONumber, Buffer.from(JSON.stringify(testConfig.output)));
            chai.expect(testConfig.output).to.deep.equal(resultAP);
        });

        it('BR-IR-012 should flag when the IFC did not receive a UCC for an RDC, from the Vendor (Missing Pallet)', async () => {
            let testConfig = TestHelper.loadAPTestConfig('BR-IR-012', ctx, testconfigSubFolder);
            let resultAP : AssetProcurement = await contract.saveIFCReceived(ctx, testConfig.input.PONumber, testConfig.input.IFCReceiveds);
            ctx.stub.putPrivateData.should.have.been.calledOnceWith(testPDCName, objectType + testConfig.input.PONumber, Buffer.from(JSON.stringify(testConfig.output)));
            chai.expect(testConfig.output).to.deep.equal(resultAP);
        });

        it('BR-IR-013 should flag when the IFC received any extra UCC’s for the RDC, from the Vendor (Additional Pallet)', async () => {
            let testConfig = TestHelper.loadAPTestConfig('BR-IR-013', ctx, testconfigSubFolder);
            let resultAP : AssetProcurement = await contract.saveIFCReceived(ctx, testConfig.input.PONumber, testConfig.input.IFCReceiveds);
            ctx.stub.putPrivateData.should.have.been.calledOnceWith(testPDCName, objectType + testConfig.input.PONumber, Buffer.from(JSON.stringify(testConfig.output)));
            chai.expect(testConfig.output).to.deep.equal(resultAP);
        });

    });

});

