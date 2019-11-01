declare const _true: unique symbol;
declare const _false: unique symbol;
declare type SBool = typeof _true | typeof _false;
declare class EBool {
    readonly bool: SBool;
    constructor(bool: SBool);
}
export declare const _if: (v: any) => SBool;
export declare const _elif: (v: any) => EBool;
export declare const _else: EBool;
export declare const _end: unique symbol;
export declare function tpl(literals: TemplateStringsArray, ...placeholders: any[]): string;
export {};
