import { TestHelper, TestContext, testPDCName } from './___test-helper';

import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import winston = require('winston');

chai.should();
chai.use(chaiAsPromised);
chai.use(sinonChai);









import { RDCReceivedContract } from '..';
import { RDCReceived, AssetProcurement, UnitOfMeasure, Discrepancy, DiscrepancyType, StageType } from '../models';

const objectType : string = ' ap ';
const testconfigSubFolder : string = 'rdcReceived';

describe('RDCReceivedContract', () => {

    let contract: RDCReceivedContract;
    let ctx: TestContext;

    beforeEach(() => {
        // Prepare the Contract and Context
        contract = new RDCReceivedContract();
        ctx = new TestContext();
    });

    describe('#saveRDCReceived', () => {

        it('BR-RR-001 should create a procurement record for new poNumbers', async () => {
            let testConfig = TestHelper.loadAPTestConfig('BR-RR-001', ctx, testconfigSubFolder);
            let resultAP : AssetProcurement = await contract.saveRDCReceived(ctx, testConfig.input.PONumber, testConfig.input.RDCReceiveds);
            ctx.stub.putPrivateData.should.have.been.calledOnceWith(testPDCName, objectType + testConfig.input.PONumber, Buffer.from(JSON.stringify(testConfig.output)));
            chai.expect(testConfig.output).to.deep.equal(resultAP);
        });

        it('BR-RR-002 should add unique new RDC Received data into previous imported data', async () => {
            let testConfig = TestHelper.loadAPTestConfig('BR-RR-002', ctx, testconfigSubFolder);
            let resultAP : AssetProcurement = await contract.saveRDCReceived(ctx, testConfig.input.PONumber, testConfig.input.RDCReceiveds);
            ctx.stub.putPrivateData.should.have.been.calledOnceWith(testPDCName, objectType + testConfig.input.PONumber, Buffer.from(JSON.stringify(testConfig.output)));
            chai.expect(testConfig.output).to.deep.equal(resultAP);
        });

        it('BR-RR-003 should replace matching, existing RDC Received data with new imported data', async () => {
            let testConfig = TestHelper.loadAPTestConfig('BR-RR-003', ctx, testconfigSubFolder);
            let resultAP : AssetProcurement = await contract.saveRDCReceived(ctx, testConfig.input.PONumber, testConfig.input.RDCReceiveds);
            ctx.stub.putPrivateData.should.have.been.calledOnceWith(testPDCName, objectType + testConfig.input.PONumber, Buffer.from(JSON.stringify(testConfig.output)));
            chai.expect(testConfig.output).to.deep.equal(resultAP);
        });

        it('BR-RR-004 should uniquely identify RDC Received data for matching new data with existing data', async () => {
            let testConfig = TestHelper.loadAPTestConfig('BR-RR-004', ctx, testconfigSubFolder);
            let resultAP : AssetProcurement = await contract.saveRDCReceived(ctx, testConfig.input.PONumber, testConfig.input.RDCReceiveds);
            ctx.stub.putPrivateData.should.have.been.calledOnceWith(testPDCName, objectType + testConfig.input.PONumber, Buffer.from(JSON.stringify(testConfig.output)));
            chai.expect(testConfig.output).to.deep.equal(resultAP);
        });

        it('BR-RR-005 should aggregate Quantity of a SKU destined for the same RDC, when determining Shortage / Overage', async () => {
            let testConfig = TestHelper.loadAPTestConfig('BR-RR-005', ctx, testconfigSubFolder);
            let resultAP : AssetProcurement = await contract.saveRDCReceived(ctx, testConfig.input.PONumber, testConfig.input.RDCReceiveds);
            ctx.stub.putPrivateData.should.have.been.calledOnceWith(testPDCName, objectType + testConfig.input.PONumber, Buffer.from(JSON.stringify(testConfig.output)));
            chai.expect(testConfig.output).to.deep.equal(resultAP);
        });

        it('BR-RR-006 should flag when the Purchase Order data is missing for this PO Number (Missing PO)', async () => {
            let testConfig = TestHelper.loadAPTestConfig('BR-RR-006', ctx, testconfigSubFolder);
            let resultAP : AssetProcurement = await contract.saveRDCReceived(ctx, testConfig.input.PONumber, testConfig.input.RDCReceiveds);
            ctx.stub.putPrivateData.should.have.been.calledOnceWith(testPDCName, objectType + testConfig.input.PONumber, Buffer.from(JSON.stringify(testConfig.output)));
            chai.expect(testConfig.output).to.deep.equal(resultAP);
        });

        it('BR-RR-007 should flag when the Vendor Shipped data is missing for this PO Number (Missing Vendor Shipped)', async () => {
            let testConfig = TestHelper.loadAPTestConfig('BR-RR-007', ctx, testconfigSubFolder);
            let resultAP : AssetProcurement = await contract.saveRDCReceived(ctx, testConfig.input.PONumber, testConfig.input.RDCReceiveds);
            ctx.stub.putPrivateData.should.have.been.calledOnceWith(testPDCName, objectType + testConfig.input.PONumber, Buffer.from(JSON.stringify(testConfig.output)));
            chai.expect(testConfig.output).to.deep.equal(resultAP);
        });

        it('BR-RR-008 should flag when the RDC received a SKU from Vendor that was not on the PO (Wrong SKU)', async () => {
            let testConfig = TestHelper.loadAPTestConfig('BR-RR-008', ctx, testconfigSubFolder);
            let resultAP : AssetProcurement = await contract.saveRDCReceived(ctx, testConfig.input.PONumber, testConfig.input.RDCReceiveds);
            ctx.stub.putPrivateData.should.have.been.calledOnceWith(testPDCName, objectType + testConfig.input.PONumber, Buffer.from(JSON.stringify(testConfig.output)));
            chai.expect(testConfig.output).to.deep.equal(resultAP);
        });

        it('BR-RR-009 should flag when the RDC received a SKU destined for an RDC different from PO (Wrong RDC)', async () => {
            let testConfig = TestHelper.loadAPTestConfig('BR-RR-009', ctx, testconfigSubFolder);
            let resultAP : AssetProcurement = await contract.saveRDCReceived(ctx, testConfig.input.PONumber, testConfig.input.RDCReceiveds);
            ctx.stub.putPrivateData.should.have.been.calledOnceWith(testPDCName, objectType + testConfig.input.PONumber, Buffer.from(JSON.stringify(testConfig.output)));
            chai.expect(testConfig.output).to.deep.equal(resultAP);
        });

        it('BR-RR-010 should flag when the RDC received less SKU Quantity from Vendor than Vendor Shipped (Shortage)', async () => {
            let testConfig = TestHelper.loadAPTestConfig('BR-RR-010', ctx, testconfigSubFolder);
            let resultAP : AssetProcurement = await contract.saveRDCReceived(ctx, testConfig.input.PONumber, testConfig.input.RDCReceiveds);
            ctx.stub.putPrivateData.should.have.been.calledOnceWith(testPDCName, objectType + testConfig.input.PONumber, Buffer.from(JSON.stringify(testConfig.output)));
            chai.expect(testConfig.output).to.deep.equal(resultAP);
        });

        it('BR-RR-011 should flag when the RDC received more SKU Quantity from Vendor than Vendor Shipped (Overage)', async () => {
            let testConfig = TestHelper.loadAPTestConfig('BR-RR-011', ctx, testconfigSubFolder);
            let resultAP : AssetProcurement = await contract.saveRDCReceived(ctx, testConfig.input.PONumber, testConfig.input.RDCReceiveds);
            ctx.stub.putPrivateData.should.have.been.calledOnceWith(testPDCName, objectType + testConfig.input.PONumber, Buffer.from(JSON.stringify(testConfig.output)));
            chai.expect(testConfig.output).to.deep.equal(resultAP);
        });

        it('BR-RR-012 should update Recommended Solution to "Pack size discrepancy" when RDC received less SKU quantity but (Abs| RDC In Qty - Sup ASN Qty |)/package_qty is not whole number, i.e wrong SKU quantities counted', async () => {
            let testConfig = TestHelper.loadAPTestConfig('BR-RR-012', ctx, testconfigSubFolder);
            let resultAP : AssetProcurement = await contract.saveRDCReceived(ctx, testConfig.input.PONumber, testConfig.input.RDCReceiveds);
            ctx.stub.putPrivateData.should.have.been.calledOnceWith(testPDCName, objectType + testConfig.input.PONumber, Buffer.from(JSON.stringify(testConfig.output)));
            chai.expect(testConfig.output).to.deep.equal(resultAP);
        });
        
        it('BR-RR-013 should update Recommended Solution to "Pack size discrepancy" when RDC received More SKU quantity but (Abs| RDC In Qty - Sup ASN Qty |)/package_qty is not whole number, i.e wrong SKU quantities counted', async () => {
            let testConfig = TestHelper.loadAPTestConfig('BR-RR-013', ctx, testconfigSubFolder);
            let resultAP : AssetProcurement = await contract.saveRDCReceived(ctx, testConfig.input.PONumber, testConfig.input.RDCReceiveds);
            ctx.stub.putPrivateData.should.have.been.calledOnceWith(testPDCName, objectType + testConfig.input.PONumber, Buffer.from(JSON.stringify(testConfig.output)));
            chai.expect(testConfig.output).to.deep.equal(resultAP);
        });

    });

});

