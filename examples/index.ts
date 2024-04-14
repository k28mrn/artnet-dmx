import { ArtnetDMX } from '../src/index';

const artnet = new ArtnetDMX({ host: '100.0.0.10', });

const exec = async () => {
  const data = new Uint8Array(512);
  data[0] = 20;
  data[1] = 0;
  data[2] = 255;
  data[3] = 255;
  data[4] = 0;
  data[6] = 0;
  data[7] = 0;

  artnet.send({
    data: data,
    callback: (status, message) => {
      console.log(status, message);
    }
  });
};

exec();