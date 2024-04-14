export const BROADCAST = '255.255.255.255';
export const PORT = 6454;
export const MAX_CHANNELS = 512;
export const HEADER_DATA = [
  'A'.charCodeAt(0),  // ID: Art-Net
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
