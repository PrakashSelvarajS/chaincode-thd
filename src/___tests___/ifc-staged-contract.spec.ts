import { TestHelper, TestContext, testPDCName } from './___test-helper';

import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import winston = require('winston');

chai.should();
chai.use(chaiAsPromised);
chai.use(sinonChai);









import { IFCStagedContract } from '..';
import { IFCStaged, AssetProcurement, UnitOfMeasure, Discrepancy, DiscrepancyType, StageType } from '../models';

const objectType : string = ' ap ';
const testconfigSubFolder : string = 'ifcStaged';

describe('IFCStagedContract', () => {

    let contract: IFCStagedContract;
    let ctx: TestContext;

    beforeEach(() => {
        // Prepare the Contract and Context
        contract = new IFCStagedContract();
        ctx = new TestContext();
    });

    describe('#saveIFCStaged', () => {

        it('BR-IST-001 should create a procurement record for new poNumbers', async () => {
            let testConfig = TestHelper.loadAPTestConfig('BR-IST-001', ctx, testconfigSubFolder);
            let resultAP : AssetProcurement = await contract.saveIFCStaged(ctx, testConfig.input.PONumber, testConfig.input.IFCStageds);
            ctx.stub.putPrivateData.should.have.been.calledOnceWith(testPDCName, objectType + testConfig.input.PONumber, Buffer.from(JSON.stringify(testConfig.output)));
            chai.expect(testConfig.output).to.deep.equal(resultAP);
        });

        it('BR-IST-002 should add unique new IFC Staged data into previous imported data', async () => {
            let testConfig = TestHelper.loadAPTestConfig('BR-IST-002', ctx, testconfigSubFolder);
            let resultAP : AssetProcurement = await contract.saveIFCStaged(ctx, testConfig.input.PONumber, testConfig.input.IFCStageds);
            ctx.stub.putPrivateData.should.have.been.calledOnceWith(testPDCName, objectType + testConfig.input.PONumber, Buffer.from(JSON.stringify(testConfig.output)));
            chai.expect(testConfig.output).to.deep.equal(resultAP);
        });

        it('BR-IST-003 should replace matching, existing IFC Staged data with new imported data', async () => {
            let testConfig = TestHelper.loadAPTestConfig('BR-IST-003', ctx, testconfigSubFolder);
            let resultAP : AssetProcurement = await contract.saveIFCStaged(ctx, testConfig.input.PONumber, testConfig.input.IFCStageds);
            ctx.stub.putPrivateData.should.have.been.calledOnceWith(testPDCName, objectType + testConfig.input.PONumber, Buffer.from(JSON.stringify(testConfig.output)));
            chai.expect(testConfig.output).to.deep.equal(resultAP);
        });

        it('BR-IST-004 should uniquely identify IFC Staged data for matching new data with existing data', async () => {
            let testConfig = TestHelper.loadAPTestConfig('BR-IST-004', ctx, testconfigSubFolder);
            let resultAP : AssetProcurement = await contract.saveIFCStaged(ctx, testConfig.input.PONumber, testConfig.input.IFCStageds);
            ctx.stub.putPrivateData.should.have.been.calledOnceWith(testPDCName, objectType + testConfig.input.PONumber, Buffer.from(JSON.stringify(testConfig.output)));
            chai.expect(testConfig.output).to.deep.equal(resultAP);
        });

        it('BR-IST-005 should aggregate Quantity of a SKU on the same UCC128, destined for the same RDC', async () => {
            let testConfig = TestHelper.loadAPTestConfig('BR-IST-005', ctx, testconfigSubFolder);
            let resultAP : AssetProcurement = await contract.saveIFCStaged(ctx, testConfig.input.PONumber, testConfig.input.IFCStageds);
            ctx.stub.putPrivateData.should.have.been.calledOnceWith(testPDCName, objectType + testConfig.input.PONumber, Buffer.from(JSON.stringify(testConfig.output)));
            chai.expect(testConfig.output).to.deep.equal(resultAP);
        });

        it('BR-IST-006 should flag when the PurchaseOrder data is missing for this PO Number (Missing PO)', async () => {
            let testConfig = TestHelper.loadAPTestConfig('BR-IST-006', ctx, testconfigSubFolder);
            let resultAP : AssetProcurement = await contract.saveIFCStaged(ctx, testConfig.input.PONumber, testConfig.input.IFCStageds);
            ctx.stub.putPrivateData.should.have.been.calledOnceWith(testPDCName, objectType + testConfig.input.PONumber, Buffer.from(JSON.stringify(testConfig.output)));
            chai.expect(testConfig.output).to.deep.equal(resultAP);
        });

        it('BR-IST-007 should flag when the Vendor Shipped data is missing for this PO Number (Missing Vendor Shipped)', async () => {
            let testConfig = TestHelper.loadAPTestConfig('BR-IST-007', ctx, testconfigSubFolder);
            let resultAP : AssetProcurement = await contract.saveIFCStaged(ctx, testConfig.input.PONumber, testConfig.input.IFCStageds);
            ctx.stub.putPrivateData.should.have.been.calledOnceWith(testPDCName, objectType + testConfig.input.PONumber, Buffer.from(JSON.stringify(testConfig.output)));
            chai.expect(testConfig.output).to.deep.equal(resultAP);
        });

        it('BR-IST-008 should flag when the IFC staged a SKU from Vendor that was not on the PO (Wrong SKU)', async () => {
            let testConfig = TestHelper.loadAPTestConfig('BR-IST-008', ctx, testconfigSubFolder);
            let resultAP : AssetProcurement = await contract.saveIFCStaged(ctx, testConfig.input.PONumber, testConfig.input.IFCStageds);
            ctx.stub.putPrivateData.should.have.been.calledOnceWith(testPDCName, objectType + testConfig.input.PONumber, Buffer.from(JSON.stringify(testConfig.output)));
            chai.expect(testConfig.output).to.deep.equal(resultAP);
        });

        it('BR-IST-009 should flag when the IFC staged a SKU destined for an RDC different from PO (Wrong RDC)', async () => {
            let testConfig = TestHelper.loadAPTestConfig('BR-IST-009', ctx, testconfigSubFolder);
            let resultAP : AssetProcurement = await contract.saveIFCStaged(ctx, testConfig.input.PONumber, testConfig.input.IFCStageds);
            ctx.stub.putPrivateData.should.have.been.calledOnceWith(testPDCName, objectType + testConfig.input.PONumber, Buffer.from(JSON.stringify(testConfig.output)));
            chai.expect(testConfig.output).to.deep.equal(resultAP);
        });

        it('BR-IST-010 should flag when the IFC staged less SKU Quantity from Vendor than Vendor Shipped (Shortage)', async () => {
            let testConfig = TestHelper.loadAPTestConfig('BR-IST-010', ctx, testconfigSubFolder);
            let resultAP : AssetProcurement = await contract.saveIFCStaged(ctx, testConfig.input.PONumber, testConfig.input.IFCStageds);
            ctx.stub.putPrivateData.should.have.been.calledOnceWith(testPDCName, objectType + testConfig.input.PONumber, Buffer.from(JSON.stringify(testConfig.output)));
            chai.expect(testConfig.output).to.deep.equal(resultAP);
        });

        it('BR-IST-011 should flag when the IFC staged more SKU Quantity from Vendor than Vendor Shipped (Overage)', async () => {
            let testConfig = TestHelper.loadAPTestConfig('BR-IST-011', ctx, testconfigSubFolder);
            let resultAP : AssetProcurement = await contract.saveIFCStaged(ctx, testConfig.input.PONumber, testConfig.input.IFCStageds);
            ctx.stub.putPrivateData.should.have.been.calledOnceWith(testPDCName, objectType + testConfig.input.PONumber, Buffer.from(JSON.stringify(testConfig.output)));
            chai.expect(testConfig.output).to.deep.equal(resultAP);
        });

        it('BR-IST-012 should flag when the IFC did not receive a UCC for an RDC, from the Vendor (Missing Pallet)', async () => {
            let testConfig = TestHelper.loadAPTestConfig('BR-IST-012', ctx, testconfigSubFolder);
            let resultAP : AssetProcurement = await contract.saveIFCStaged(ctx, testConfig.input.PONumber, testConfig.input.IFCStageds);
            ctx.stub.putPrivateData.should.have.been.calledOnceWith(testPDCName, objectType + testConfig.input.PONumber, Buffer.from(JSON.stringify(testConfig.output)));
            chai.expect(testConfig.output).to.deep.equal(resultAP);
        });

        it('BR-IST-013 should flag when the IFC received any extra UCC’s for the RDC, from the Vendor (Additional Pallet)', async () => {
            let testConfig = TestHelper.loadAPTestConfig('BR-IST-013', ctx, testconfigSubFolder);
            let resultAP : AssetProcurement = await contract.saveIFCStaged(ctx, testConfig.input.PONumber, testConfig.input.IFCStageds);
            ctx.stub.putPrivateData.should.have.been.calledOnceWith(testPDCName, objectType + testConfig.input.PONumber, Buffer.from(JSON.stringify(testConfig.output)));
            chai.expect(testConfig.output).to.deep.equal(resultAP);
        });

    });

});

