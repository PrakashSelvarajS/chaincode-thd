"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const fabric_contract_api_1 = require("fabric-contract-api");
const property_validator_decorator_1 = require("../decorators/property-validator.decorator");
let ValidatorConfigContract = class ValidatorConfigContract extends fabric_contract_api_1.Contract {
    constructor() { super("com.homedepot.procurement.ValidatorConfigContract"); }
    async logCurrentValidationConfig(ctx) {
        property_validator_decorator_1.ListValidatorConfigs();
    }
};
__decorate([
    fabric_contract_api_1.Transaction(false),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context]),
    __metadata("design:returntype", Promise)
], ValidatorConfigContract.prototype, "logCurrentValidationConfig", null);
ValidatorConfigContract = __decorate([
    fabric_contract_api_1.Info({ title: 'ValidatorConfigContract', description: 'Contract for managing the configuration of the DataModel Validators' }),
    __metadata("design:paramtypes", [])
], ValidatorConfigContract);
exports.ValidatorConfigContract = ValidatorConfigContract;
//# sourceMappingURL=validator-config.contract.js.map