export declare const isFunction: (fn: any) => boolean;
export declare const isString: (o: any) => boolean;
export declare const isPlainObject: (o: any) => boolean;
export declare const isPromise: (o: any) => boolean;
export declare const reflect: (p: Promise<any>) => Promise<{
    value: any;
    success: boolean;
} | {
    value: any;
    success: boolean;
}>;
export declare const settledPromise: (ps: Array<Promise<any>>) => Promise<({
    value: any;
    success: boolean;
} | {
    value: any;
    success: boolean;
})[]>;
export declare const canIUseProxy: () => boolean;
export declare const createHiddenProperty: (target: object, prop: PropertyKey, value: any) => void;
export declare const hasSymbol: boolean;
export declare const TRACKER: unique symbol;
export declare const isTrackable: (o: any) => boolean;
