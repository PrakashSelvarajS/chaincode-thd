import 'reflect-metadata';
export declare function ValidatedObject(): (constructor: Function) => void;
export interface ValidatorConfig {
    key?: Symbol;
}
export declare function ListValidatorConfigs(): void;
export interface NumberRangeConfig extends ValidatorConfig {
    minimum?: number;
    maximum?: number;
    defaultMinimum?: number;
    defaultMaximum?: number;
}
export declare function NumberRangeValidator(config: NumberRangeConfig): (target: any, propertyKey: string | symbol) => any;
export interface TextConfig extends ValidatorConfig {
    minimumLength?: number;
    maximumLength?: number;
    allowLeadingSpaces?: boolean;
    allowTrailingSpaces?: boolean;
    characterSetRegularExpression?: RegExp;
}
export declare function TextValidator(config: TextConfig): (target: any, propertyKey: string | symbol) => any;
