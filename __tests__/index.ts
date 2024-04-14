import { ArtnetDMX } from '../src/index';

describe('ArtnetSend', () => {
  let artnetDmx: ArtnetDMX;

  beforeEach(() => {
    artnetDmx = new ArtnetDMX({ host: '100.0.0.10' });
  });

  it('should initialize with default options', () => {
    expect(artnetDmx).toBeTruthy();
  });

  it('should send a DMX data', () => {
    const callback = jest.fn((status, message) => console.log(status, message));
    const data = new Uint8Array(512);
    data[3] = 255;
    data[4] = 255;
    data[5] = 255;
    artnetDmx.send({ data, callback });
    expect(callback).toHaveBeenCalled();
  });
});