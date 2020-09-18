export declare const warn: (...args: Array<any>) => void;
export declare const log: (...args: Array<any>) => void;
export declare const error: (props: {
    type: string;
    message: string;
}) => void;
export declare const logActivity: (moduleName: string, { message, value }: {
    message: string;
    value?: any;
}) => void;
