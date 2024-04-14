/// <reference types="node" />
import EventEmitter from 'node:events';
import { OptionsProps, SendProps } from './interfaces';
/**
 * ArtnetDMX
 */
export declare class ArtnetDMX extends EventEmitter {
    #private;
    constructor(options?: OptionsProps);
    /**
     * Change the options
     */
    changeOptions: (options: OptionsProps) => void;
    /**
     * Close the socket
     */
    close: () => void;
    /**
     * Send data to the specified universe
     */
    send({ universe, data, callback, }: SendProps): void;
}
