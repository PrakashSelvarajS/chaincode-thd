import { Context } from 'fabric-contract-api';
import { ChaincodeStub, ClientIdentity } from 'fabric-shim';
import { AssetProcurement, UnitOfMeasureList, ADRRuleList } from "../models";
import * as sinon from 'sinon';
export declare class APTestConfig {
    input: AssetProcurement;
    output: AssetProcurement;
    existingAPs?: AssetProcurement[];
    existingUOMs?: UnitOfMeasureList;
    existingADRs?: ADRRuleList;
    constructor(init?: Partial<APTestConfig>);
}
export declare class TestContext implements Context {
    stub: sinon.SinonStubbedInstance<ChaincodeStub>;
    clientIdentity: sinon.SinonStubbedInstance<ClientIdentity>;
    logging: {
        getLogger: sinon.SinonStub<any[], any>;
        setLevel: sinon.SinonStub<any[], any>;
    };
}
export declare let testPDCName: string;
export declare class TestHelper {
    constructor();
    static loadAPTestConfig(testID: string, ctx: TestContext, subfolder?: string | undefined): APTestConfig;
}
