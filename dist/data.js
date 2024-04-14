"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HEADER_DATA = exports.MAX_CHANNELS = exports.PORT = exports.BROADCAST = void 0;
exports.BROADCAST = '255.255.255.255';
exports.PORT = 6454;
exports.MAX_CHANNELS = 512;
exports.HEADER_DATA = [
    'A'.charCodeAt(0), // ID: Art-Net
    'r'.charCodeAt(0),
    't'.charCodeAt(0),
    '-'.charCodeAt(0),
    'N'.charCodeAt(0),
    'e'.charCodeAt(0),
    't'.charCodeAt(0),
    0,
    0,
    80, // 0x50 (OpCode: OpOutput / OpDmx)
    0,
    14, // Protocol version high byte
    0, // data Sequence
    0,
];
