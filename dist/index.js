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
var _Artnet_instances, _Artnet_broadcastIp, _Artnet_maxChannels, _Artnet_options, _Artnet_socket, _Artnet_data, _Artnet_lastedData, _Artnet_init, _Artnet_setBroadcast, _Artnet_addEventListeners, _Artnet_onError;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Artnet = void 0;
const node_dgram_1 = __importDefault(require("node:dgram"));
const node_events_1 = __importDefault(require("node:events"));
const enums_1 = require("./enums");
const data_1 = require("./data");
/**
 * Artnet
 */
class Artnet extends node_events_1.default {
    constructor(options = {}) {
        super();
        _Artnet_instances.add(this);
        _Artnet_broadcastIp.set(this, data_1.BROADCAST);
        _Artnet_maxChannels.set(this, data_1.MAX_CHANNELS);
        _Artnet_options.set(this, {
            host: __classPrivateFieldGet(this, _Artnet_broadcastIp, "f"), // Broadcast
            port: data_1.PORT, // Artnet port
        });
        _Artnet_socket.set(this, void 0);
        _Artnet_data.set(this, []);
        _Artnet_lastedData.set(this, []);
        /**
         * Set the socket to broadcast
         */
        _Artnet_setBroadcast.set(this, () => {
            if (__classPrivateFieldGet(this, _Artnet_options, "f").host === __classPrivateFieldGet(this, _Artnet_broadcastIp, "f")) {
                __classPrivateFieldGet(this, _Artnet_socket, "f").bind(__classPrivateFieldGet(this, _Artnet_options, "f").port, () => {
                    __classPrivateFieldGet(this, _Artnet_socket, "f").setBroadcast(true);
                });
            }
        });
        _Artnet_onError.set(this, (error) => {
            this.emit(enums_1.EventType.Error, error);
        });
        __classPrivateFieldSet(this, _Artnet_options, { ...__classPrivateFieldGet(this, _Artnet_options, "f"), ...options }, "f");
        __classPrivateFieldSet(this, _Artnet_socket, node_dgram_1.default.createSocket({ type: 'udp4', reuseAddr: true }), "f");
        __classPrivateFieldGet(this, _Artnet_instances, "m", _Artnet_init).call(this);
    }
    /**
     * Send data to the specified universe
     */
    send({ universe = 0, data, callback, }) {
        // Check if data is an array
        if (data.length !== __classPrivateFieldGet(this, _Artnet_maxChannels, "f")) {
            callback?.(enums_1.SendStatus.error, `Data length must be ${__classPrivateFieldGet(this, _Artnet_maxChannels, "f")}`);
            return;
        }
        let isChanged = false;
        // Check if universe exists
        if (!__classPrivateFieldGet(this, _Artnet_data, "f")[universe]) {
            __classPrivateFieldGet(this, _Artnet_data, "f")[universe] = [...data];
            isChanged = true;
        }
        else {
            // Check if data is changed
            __classPrivateFieldGet(this, _Artnet_lastedData, "f")[universe] = [...__classPrivateFieldGet(this, _Artnet_data, "f")[universe]];
            __classPrivateFieldGet(this, _Artnet_data, "f")[universe] = [...data.slice(0, __classPrivateFieldGet(this, _Artnet_maxChannels, "f"))];
            for (let i = 0; i < __classPrivateFieldGet(this, _Artnet_lastedData, "f")[universe].length; i++) {
                if (__classPrivateFieldGet(this, _Artnet_lastedData, "f")[universe][i] !== __classPrivateFieldGet(this, _Artnet_data, "f")[universe][i]) {
                    isChanged = true;
                    break;
                }
                ;
            }
        }
        // Same data, no need to send
        if (!isChanged) {
            callback?.(enums_1.SendStatus.noChange);
            return;
        }
        // Universe
        const highUni = (universe >> 8) & 0xff;
        const lowUni = universe & 0xff;
        // data length
        const length = __classPrivateFieldGet(this, _Artnet_data, "f")[universe].length;
        const hightLen = (length >> 8) & 0xff;
        const lowLen = length & 0xff;
        // DMX data header
        const header = [...data_1.HEADER_DATA, highUni, lowUni, hightLen, lowLen];
        // DMX data
        const combinedData = header.concat(__classPrivateFieldGet(this, _Artnet_data, "f")[universe]);
        const buffer = Buffer.from(combinedData);
        // Send data
        const { host, port } = __classPrivateFieldGet(this, _Artnet_options, "f");
        __classPrivateFieldGet(this, _Artnet_socket, "f").send(buffer, 0, buffer.length, port, host, (error) => {
            if (error) {
                callback?.(enums_1.SendStatus.error, "Error sending data.");
                return;
            }
            callback?.(enums_1.SendStatus.success);
        });
    }
}
exports.Artnet = Artnet;
_Artnet_broadcastIp = new WeakMap(), _Artnet_maxChannels = new WeakMap(), _Artnet_options = new WeakMap(), _Artnet_socket = new WeakMap(), _Artnet_data = new WeakMap(), _Artnet_lastedData = new WeakMap(), _Artnet_setBroadcast = new WeakMap(), _Artnet_onError = new WeakMap(), _Artnet_instances = new WeakSet(), _Artnet_init = function _Artnet_init() {
    __classPrivateFieldGet(this, _Artnet_setBroadcast, "f").call(this);
    __classPrivateFieldGet(this, _Artnet_instances, "m", _Artnet_addEventListeners).call(this);
}, _Artnet_addEventListeners = function _Artnet_addEventListeners() {
    __classPrivateFieldGet(this, _Artnet_socket, "f").on("error", __classPrivateFieldGet(this, _Artnet_onError, "f"));
};
