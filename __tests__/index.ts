import { Artnet } from '../src/index';

describe('ArtnetSend', () => {
  let artnet: Artnet;

  beforeEach(() => {
    artnet = new Artnet({ host: '100.0.0.10' });
  });

  it('should initialize with default options', () => {
    expect(artnet).toBeTruthy();
  });

  it('should send a DMX data', () => {
    const callback = jest.fn((status, message) => console.log(status, message));
    const values = new Uint8Array(512);
    values[3] = 255;
    values[4] = 255;
    values[5] = 255;
    artnet.send({ values, callback });
    expect(callback).toHaveBeenCalled();
  });
});