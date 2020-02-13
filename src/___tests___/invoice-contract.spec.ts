import { TestHelper, TestContext, testPDCName } from './___test-helper';

import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import winston = require('winston');

chai.should();
chai.use(chaiAsPromised);
chai.use(sinonChai);









import { InvoiceContract } from '..';
import { Invoice, AssetProcurement, UnitOfMeasure, Discrepancy, DiscrepancyType, StageType } from '../models';

const objectType : string = ' ap ';
const testconfigSubFolder : string = 'invoice';

describe('InvoiceContract', () => {

    let contract: InvoiceContract;
    let ctx: TestContext;

    beforeEach(() => {
        // Prepare the Contract and Context
        contract = new InvoiceContract();
        ctx = new TestContext();
    });

    describe('#saveInvoice', () => {

        it('BR-INV-001 should create a procurement record for new poNumbers', async () => {
            let testConfig = TestHelper.loadAPTestConfig('BR-INV-001', ctx, testconfigSubFolder);
            let resultAP : AssetProcurement = await contract.saveInvoice(ctx, testConfig.input.PONumber, testConfig.input.Invoices);
            ctx.stub.putPrivateData.should.have.been.calledOnceWith(testPDCName, objectType + testConfig.input.PONumber, Buffer.from(JSON.stringify(testConfig.output)));
            chai.expect(testConfig.output).to.deep.equal(resultAP);
        });

        it('BR-INV-002 should add unique new Invoice data into previous imported data', async () => {
            let testConfig = TestHelper.loadAPTestConfig('BR-INV-002', ctx, testconfigSubFolder);
            let resultAP : AssetProcurement = await contract.saveInvoice(ctx, testConfig.input.PONumber, testConfig.input.Invoices);
            ctx.stub.putPrivateData.should.have.been.calledOnceWith(testPDCName, objectType + testConfig.input.PONumber, Buffer.from(JSON.stringify(testConfig.output)));
            chai.expect(testConfig.output).to.deep.equal(resultAP);
        });

        it('BR-INV-003 should replace matching, existing Invoice data with new imported data', async () => {
            let testConfig = TestHelper.loadAPTestConfig('BR-INV-003', ctx, testconfigSubFolder);
            let resultAP : AssetProcurement = await contract.saveInvoice(ctx, testConfig.input.PONumber, testConfig.input.Invoices);
            ctx.stub.putPrivateData.should.have.been.calledOnceWith(testPDCName, objectType + testConfig.input.PONumber, Buffer.from(JSON.stringify(testConfig.output)));
            chai.expect(testConfig.output).to.deep.equal(resultAP);
        });

        it('BR-INV-004 should uniquely identify Invoice data for matching new data with existing data', async () => {
            let testConfig = TestHelper.loadAPTestConfig('BR-INV-004', ctx, testconfigSubFolder);
            let resultAP : AssetProcurement = await contract.saveInvoice(ctx, testConfig.input.PONumber, testConfig.input.Invoices);
            ctx.stub.putPrivateData.should.have.been.calledOnceWith(testPDCName, objectType + testConfig.input.PONumber, Buffer.from(JSON.stringify(testConfig.output)));
            chai.expect(testConfig.output).to.deep.equal(resultAP);
        });

        it('BR-INV-005 should flag when the Purchase Order data is missing for this PO Number (Missing PO)', async () => {
            let testConfig = TestHelper.loadAPTestConfig('BR-INV-005', ctx, testconfigSubFolder);
            let resultAP : AssetProcurement = await contract.saveInvoice(ctx, testConfig.input.PONumber, testConfig.input.Invoices);
            ctx.stub.putPrivateData.should.have.been.calledOnceWith(testPDCName, objectType + testConfig.input.PONumber, Buffer.from(JSON.stringify(testConfig.output)));
            chai.expect(testConfig.output).to.deep.equal(resultAP);
        });

        it('BR-INV-006 should flag when the Vendor Shipped data is missing for this PO Number (Missing Vendor Shipped)', async () => {
            let testConfig = TestHelper.loadAPTestConfig('BR-INV-006', ctx, testconfigSubFolder);
            let resultAP : AssetProcurement = await contract.saveInvoice(ctx, testConfig.input.PONumber, testConfig.input.Invoices);
            ctx.stub.putPrivateData.should.have.been.calledOnceWith(testPDCName, objectType + testConfig.input.PONumber, Buffer.from(JSON.stringify(testConfig.output)));
            chai.expect(testConfig.output).to.deep.equal(resultAP);
        });

    });

});

