import { SendStatus } from "./enums";
export interface OptionsProps {
    host?: string;
    port?: number;
}
export interface SendProps {
    universe?: number;
    data: Uint8Array;
    callback?: (status: SendStatus, message?: string) => void;
}
