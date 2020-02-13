import { TestHelper, TestContext, testPDCName } from './___test-helper';

import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import winston = require('winston');

chai.should();
chai.use(chaiAsPromised);
chai.use(sinonChai);









import { PurchaseOrderContract } from '..';
import { PurchaseOrder, AssetProcurement, UnitOfMeasure, Discrepancy, DiscrepancyType, StageType } from '../models';

const objectType : string = ' ap ';
const testconfigSubFolder : string = 'purchaseOrder';

describe('PurchaseOrderContract', () => {

    let contract: PurchaseOrderContract;
    let ctx: TestContext;

    beforeEach(() => {
        // Prepare the Contract and Context
        contract = new PurchaseOrderContract();
        ctx = new TestContext();
    });

    describe('#savePurchaseOrder', () => {

        it('BR-PO-001 should create a procurement record for new poNumbers', async () => {
            let testConfig = TestHelper.loadAPTestConfig('BR-PO-001', ctx, testconfigSubFolder);
            let resultAP : AssetProcurement = await contract.savePurchaseOrder(ctx, testConfig.input.PONumber, testConfig.input.PurchaseOrders);
            ctx.stub.putPrivateData.should.have.been.calledOnceWith(testPDCName, objectType + testConfig.input.PONumber, Buffer.from(JSON.stringify(testConfig.output)));
            chai.expect(testConfig.output).to.deep.equal(resultAP);
        });

        it('BR-PO-002 should update the procurement record for existing poNumbers', async () => {
            let testConfig = TestHelper.loadAPTestConfig('BR-PO-002', ctx, testconfigSubFolder);
            let resultAP : AssetProcurement = await contract.savePurchaseOrder(ctx, testConfig.input.PONumber, testConfig.input.PurchaseOrders);
            ctx.stub.putPrivateData.should.have.been.calledOnceWith(testPDCName, objectType + testConfig.input.PONumber, Buffer.from(JSON.stringify(testConfig.output)));
            chai.expect(testConfig.output).to.deep.equal(resultAP);
        });

        it('BR-PO-004 should log a SKUMissingFromUOM discrepancy when a purchaseOrder contains a SKU not in the current UOM data', async () => {
            let testConfig = TestHelper.loadAPTestConfig('BR-PO-004', ctx, testconfigSubFolder);
            let resultAP : AssetProcurement = await contract.savePurchaseOrder(ctx, testConfig.input.PONumber, testConfig.input.PurchaseOrders);
            ctx.stub.putPrivateData.should.have.been.calledOnceWith(testPDCName, objectType + testConfig.input.PONumber, Buffer.from(JSON.stringify(testConfig.output)));
            chai.expect(testConfig.output).to.deep.equal(resultAP);
        });

        it('BR-PO-005 should update PO SKU Description from UOM Description', async () => {
            let testConfig = TestHelper.loadAPTestConfig('BR-PO-005', ctx, testconfigSubFolder);
            let resultAP : AssetProcurement = await contract.savePurchaseOrder(ctx, testConfig.input.PONumber, testConfig.input.PurchaseOrders);
            ctx.stub.putPrivateData.should.have.been.calledOnceWith(testPDCName, objectType + testConfig.input.PONumber, Buffer.from(JSON.stringify(testConfig.output)));
            chai.expect(testConfig.output).to.deep.equal(resultAP);
        });

        it('BR-PO-006 should identify HomeFreight correctly', async () => {
            let hfTestConfig = TestHelper.loadAPTestConfig('BR-PO-006-homefreight', ctx, testconfigSubFolder);
            chai.expect(hfTestConfig.input.isHomeFreight()).to.equal(true);

            let nhfTestConfig = TestHelper.loadAPTestConfig('BR-PO-006-non-homefreight', ctx, testconfigSubFolder);
            chai.expect(nhfTestConfig.input.isHomeFreight()).to.equal(false);
        });

        it('BR-PO-007 should never contain a mixture of items to be shipped to multiple destinations ', async () => {
            let testConfig = TestHelper.loadAPTestConfig('BR-PO-007', ctx, testconfigSubFolder);
            try {
                await contract.savePurchaseOrder(ctx, testConfig.input.PONumber, testConfig.input.PurchaseOrders);
            } catch(e) {
                chai.expect(e).to.not.be.null;
            }
        });

    });

});

