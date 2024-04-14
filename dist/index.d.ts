/// <reference types="node" />
import EventEmitter from 'node:events';
import { OptionsProps, SendProps } from './interfaces';
/**
 * Artnet
 */
export declare class Artnet extends EventEmitter {
    #private;
    constructor(options?: OptionsProps);
    /**
     * Send data to the specified universe
     */
    send({ universe, data, callback, }: SendProps): void;
}