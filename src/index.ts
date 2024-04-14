import dgram from 'node:dgram';
import EventEmitter from 'node:events';
import { OptionsProps, SendProps } from './interfaces';
import { EventType, SendStatus } from './enums';
import { BROADCAST, HEADER_DATA, MAX_CHANNELS, PORT } from './data';

/**
 * Artnet 
 */
export class Artnet extends EventEmitter {
  #broadcastIp = BROADCAST;
  #maxChannels = MAX_CHANNELS;

  #options: OptionsProps = {
    host: this.#broadcastIp, // Broadcast
    port: PORT,        // Artnet port
  };

  #socket: dgram.Socket;
  #data: number[][] = [];
  #lastedData: number[][] = [];

  constructor(options: OptionsProps = {}) {
    super();
    this.#options = { ...this.#options, ...options };
    this.#socket = dgram.createSocket({ type: 'udp4', reuseAddr: true });
    this.#init();
  }

  /**
   * Initialize the Artnet instance
   */
  #init() {
    this.#setBroadcast();
    this.#addEventListeners();
  }

  /**
   * Set the socket to broadcast
   */
  #setBroadcast = () => {
    if (this.#options.host === this.#broadcastIp) {
      this.#socket.bind(this.#options.port, () => {
        this.#socket.setBroadcast(true);
      });
    }
  };

  /**
   * Send data to the specified universe
   */
  send({ universe = 0, data, callback, }: SendProps) {
    // Check if data is an array
    if (data.length !== this.#maxChannels) {
      callback?.(SendStatus.error, `Data length must be ${this.#maxChannels}`);
      return;
    }

    let isChanged = false;
    // Check if universe exists
    if (!this.#data[universe]) {
      this.#data[universe] = [...data];
      isChanged = true;
    } else {
      // Check if data is changed
      this.#lastedData[universe] = [...this.#data[universe]];
      this.#data[universe] = [...data.slice(0, this.#maxChannels)];
      for (let i = 0; i < this.#lastedData[universe].length; i++) {
        if (this.#lastedData[universe][i] !== this.#data[universe][i]) {
          isChanged = true;
          break;
        };
      }
    }

    // Same data, no need to send
    if (!isChanged) {
      callback?.(SendStatus.noChange);
      return;
    }

    // Universe
    const highUni = (universe >> 8) & 0xff;
    const lowUni = universe & 0xff;

    // data length
    const length = this.#data[universe].length;
    const hightLen = (length >> 8) & 0xff;
    const lowLen = length & 0xff;

    // DMX data header
    const header = [...HEADER_DATA, highUni, lowUni, hightLen, lowLen];

    // DMX data
    const combinedData = header.concat(this.#data[universe]);
    const buffer = Buffer.from(combinedData);

    // Send data
    const { host, port } = this.#options;
    this.#socket.send(buffer, 0, buffer.length, port, host, (error) => {
      if (error) {
        callback?.(SendStatus.error, "Error sending data.");
        return;
      }
      callback?.(SendStatus.success);
    });
  }

  #addEventListeners() {
    this.#socket.on("error", this.#onError);
  }

  #onError = (error: Error) => {
    this.emit(EventType.Error, error);
  };
}
