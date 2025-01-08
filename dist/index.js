"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _ArtnetDMX_instances, _ArtnetDMX_broadcastIp, _ArtnetDMX_maxChannels, _ArtnetDMX_isClosed, _ArtnetDMX_options, _ArtnetDMX_socket, _ArtnetDMX_data, _ArtnetDMX_lastedData, _ArtnetDMX_init, _ArtnetDMX_setBroadcast, _ArtnetDMX_addEventListeners, _ArtnetDMX_removeEventListeners, _ArtnetDMX_onError;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArtnetDMX = exports.SendStatus = void 0;
var enums_1 = require("./enums");
Object.defineProperty(exports, "SendStatus", { enumerable: true, get: function () { return enums_1.SendStatus; } });
const node_dgram_1 = __importDefault(require("node:dgram"));
const node_events_1 = __importDefault(require("node:events"));
const enums_2 = require("./enums");
const data_1 = require("./data");
/**
 * ArtnetDMX
 */
class ArtnetDMX extends node_events_1.default {
    constructor(options = {}) {
        super();
        _ArtnetDMX_instances.add(this);
        _ArtnetDMX_broadcastIp.set(this, data_1.BROADCAST);
        _ArtnetDMX_maxChannels.set(this, data_1.MAX_CHANNELS);
        _ArtnetDMX_isClosed.set(this, true);
        _ArtnetDMX_options.set(this, {
            host: __classPrivateFieldGet(this, _ArtnetDMX_broadcastIp, "f"), // Broadcast
            port: data_1.PORT, // ArtnetDMX port
        });
        _ArtnetDMX_socket.set(this, void 0);
        _ArtnetDMX_data.set(this, []);
        _ArtnetDMX_lastedData.set(this, []);
        /**
         * Set the socket to broadcast
         */
        _ArtnetDMX_setBroadcast.set(this, () => {
            if (__classPrivateFieldGet(this, _ArtnetDMX_options, "f").host === __classPrivateFieldGet(this, _ArtnetDMX_broadcastIp, "f")) {
                __classPrivateFieldGet(this, _ArtnetDMX_socket, "f").bind(__classPrivateFieldGet(this, _ArtnetDMX_options, "f").port, () => {
                    __classPrivateFieldGet(this, _ArtnetDMX_socket, "f").setBroadcast(true);
                });
            }
        });
        /**
         * Change the options
         */
        this.changeOptions = (options) => {
            this.close();
            __classPrivateFieldSet(this, _ArtnetDMX_options, { ...__classPrivateFieldGet(this, _ArtnetDMX_options, "f"), ...options }, "f");
            __classPrivateFieldSet(this, _ArtnetDMX_socket, node_dgram_1.default.createSocket({ type: 'udp4', reuseAddr: true }), "f");
            __classPrivateFieldGet(this, _ArtnetDMX_instances, "m", _ArtnetDMX_init).call(this);
        };
        /**
         * Close the socket
         */
        this.close = () => {
            if (__classPrivateFieldGet(this, _ArtnetDMX_isClosed, "f"))
                return;
            __classPrivateFieldSet(this, _ArtnetDMX_isClosed, true, "f");
            __classPrivateFieldGet(this, _ArtnetDMX_instances, "m", _ArtnetDMX_removeEventListeners).call(this);
            __classPrivateFieldGet(this, _ArtnetDMX_socket, "f").close();
        };
        _ArtnetDMX_onError.set(this, (error) => {
            this.emit(enums_2.EventType.Error, error);
        });
        __classPrivateFieldSet(this, _ArtnetDMX_options, { ...__classPrivateFieldGet(this, _ArtnetDMX_options, "f"), ...options }, "f");
        __classPrivateFieldSet(this, _ArtnetDMX_socket, node_dgram_1.default.createSocket({ type: 'udp4', reuseAddr: true }), "f");
        __classPrivateFieldGet(this, _ArtnetDMX_instances, "m", _ArtnetDMX_init).call(this);
    }
    /**
     * Send data to the specified universe
     */
    send({ universe = 0, data, callback, }) {
        if (__classPrivateFieldGet(this, _ArtnetDMX_isClosed, "f"))
            return;
        // Check if data is an array
        if (data.length !== __classPrivateFieldGet(this, _ArtnetDMX_maxChannels, "f")) {
            callback?.(enums_2.SendStatus.error, `Data length must be ${__classPrivateFieldGet(this, _ArtnetDMX_maxChannels, "f")}`);
            return;
        }
        let isChanged = false;
        // Check if universe exists
        if (!__classPrivateFieldGet(this, _ArtnetDMX_data, "f")[universe]) {
            __classPrivateFieldGet(this, _ArtnetDMX_data, "f")[universe] = [...data];
            isChanged = true;
        }
        else {
            // Check if data is changed
            __classPrivateFieldGet(this, _ArtnetDMX_lastedData, "f")[universe] = [...__classPrivateFieldGet(this, _ArtnetDMX_data, "f")[universe]];
            __classPrivateFieldGet(this, _ArtnetDMX_data, "f")[universe] = [...data.slice(0, __classPrivateFieldGet(this, _ArtnetDMX_maxChannels, "f"))];
            for (let i = 0; i < __classPrivateFieldGet(this, _ArtnetDMX_lastedData, "f")[universe].length; i++) {
                if (__classPrivateFieldGet(this, _ArtnetDMX_lastedData, "f")[universe][i] !== __classPrivateFieldGet(this, _ArtnetDMX_data, "f")[universe][i]) {
                    isChanged = true;
                    break;
                }
                ;
            }
        }
        // Same data, no need to send
        if (!isChanged) {
            callback?.(enums_2.SendStatus.noChange);
            return;
        }
        // Universe
        const highUni = (universe >> 8) & 0xff;
        const lowUni = universe & 0xff;
        // data length
        const length = __classPrivateFieldGet(this, _ArtnetDMX_data, "f")[universe].length;
        const highLen = (length >> 8) & 0xff;
        const lowLen = length & 0xff;
        // DMX data header
        const header = [...data_1.HEADER_DATA, highUni, lowUni, highLen, lowLen];
        // DMX data
        const combinedData = header.concat(__classPrivateFieldGet(this, _ArtnetDMX_data, "f")[universe]);
        const buffer = Buffer.from(combinedData);
        // Send data
        const { host, port } = __classPrivateFieldGet(this, _ArtnetDMX_options, "f");
        __classPrivateFieldGet(this, _ArtnetDMX_socket, "f").send(buffer, 0, buffer.length, port, host, (error) => {
            if (error) {
                callback?.(enums_2.SendStatus.error, "Error sending data.");
                return;
            }
            callback?.(enums_2.SendStatus.success);
        });
    }
}
exports.ArtnetDMX = ArtnetDMX;
_ArtnetDMX_broadcastIp = new WeakMap(), _ArtnetDMX_maxChannels = new WeakMap(), _ArtnetDMX_isClosed = new WeakMap(), _ArtnetDMX_options = new WeakMap(), _ArtnetDMX_socket = new WeakMap(), _ArtnetDMX_data = new WeakMap(), _ArtnetDMX_lastedData = new WeakMap(), _ArtnetDMX_setBroadcast = new WeakMap(), _ArtnetDMX_onError = new WeakMap(), _ArtnetDMX_instances = new WeakSet(), _ArtnetDMX_init = function _ArtnetDMX_init() {
    __classPrivateFieldSet(this, _ArtnetDMX_isClosed, false, "f");
    __classPrivateFieldGet(this, _ArtnetDMX_setBroadcast, "f").call(this);
    __classPrivateFieldGet(this, _ArtnetDMX_instances, "m", _ArtnetDMX_addEventListeners).call(this);
}, _ArtnetDMX_addEventListeners = function _ArtnetDMX_addEventListeners() {
    __classPrivateFieldGet(this, _ArtnetDMX_socket, "f").on("error", __classPrivateFieldGet(this, _ArtnetDMX_onError, "f"));
}, _ArtnetDMX_removeEventListeners = function _ArtnetDMX_removeEventListeners() {
    __classPrivateFieldGet(this, _ArtnetDMX_socket, "f").off("error", __classPrivateFieldGet(this, _ArtnetDMX_onError, "f"));
};
