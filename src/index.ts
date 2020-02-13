/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { InitializationContract } from './contracts/_initialization.contract';
export { InitializationContract } from './contracts/_initialization.contract';

import { UnitOfMeasureContract } from './contracts/unit-of-measure.contract';
export { UnitOfMeasureContract } from './contracts/unit-of-measure.contract';

import { VendorContract } from './contracts/vendor.contract';
export { VendorContract } from './contracts/vendor.contract';

import { AssetProcurementContract } from './contracts/asset-procurement.contract';
export { AssetProcurementContract } from './contracts/asset-procurement.contract';

import { PurchaseOrderContract } from './contracts/purchase-order.contract';
export { PurchaseOrderContract } from './contracts/purchase-order.contract';

import { VendorShippedContract } from './contracts/vendor-shipped.contract';
export { VendorShippedContract } from './contracts/vendor-shipped.contract';

import { IFCReceivedContract } from './contracts/ifc-received.contract';
export { IFCReceivedContract } from './contracts/ifc-received.contract';

import { IFCStagedContract } from './contracts/ifc-staged.contract';
export { IFCStagedContract } from './contracts/ifc-staged.contract';

import { IFCShippedContract } from './contracts/ifc-shipped.contract';
export { IFCShippedContract } from './contracts/ifc-shipped.contract';

import { RDCReceivedContract } from './contracts/rdc-received.contract';
export { RDCReceivedContract } from './contracts/rdc-received.contract';

import { InvoiceContract } from './contracts/invoice.contract';
export { InvoiceContract } from './contracts/invoice.contract';

import { ADRRuleContract } from './contracts/adr-rule.contract';
export { ADRRuleContract } from './contracts/adr-rule.contract';

import { ValidatorConfigContract } from './contracts/validator-config.contract';
export { ValidatorConfigContract } from './contracts/validator-config.contract';



export const contracts: any[] = [ 
    InitializationContract,
    UnitOfMeasureContract, 
    VendorContract, 
    AssetProcurementContract, 
    PurchaseOrderContract, 
    VendorShippedContract, 
    IFCReceivedContract, 
    IFCStagedContract,
    IFCShippedContract,
    RDCReceivedContract,
    InvoiceContract,
    ADRRuleContract,
    ValidatorConfigContract
];
