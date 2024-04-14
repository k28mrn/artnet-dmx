# artnet-dmx

Art-Net DMX controller library

## Install

```sh
 $ npm install artnet-dmx
```

## Usage

```javascript
import { Artnet } from 'artnet-dmx';

const artnet = new Artnet({ host: '192.168.0.100', });
const data = new Uint8Array(512);

data[0] = 20;
data[1] = 0;
data[2] = 255;
data[3] = 255;
data[4] = 0;
data[6] = 0;
data[7] = 0;

artnet.send({data: data})

// or get callback
// artnet.send({data: data, callback: (status, message)=>{
//   // status: SendStatus, message: string
//   console.log(status, message);
// }})
```

## Options

- host: string (Default "255.255.255.255")
- port: number (Default: 6454)

## Methods

**send({ data: Uint8Array })**
**send({ data: Uint8Array, callback: (status: SendStatus, message?: string) => void; })**
**send({ universe: number, data: Uint8Array, callback: (status: SendStatus, message?: string) => void; })**

## License

The MIT License (MIT)
