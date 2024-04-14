export declare const EventType: {
    readonly Error: "error";
};
export type EventType = typeof EventType[keyof typeof EventType];
export declare const SendStatus: {
    readonly noChange: "noChange";
    readonly success: "success";
    readonly error: "error";
};
export type SendStatus = typeof SendStatus[keyof typeof SendStatus];
