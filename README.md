# pod-protocol-stream

Pod microcontroller protocol implementation.

    npm install @thermocline-labs/pod-protocol-stream

## Usage

This library is transport agnostic. It implements the binary serial protocol for communicating with the pod microcontroller. The following example shows how to use it with the serialport module.

```js
const { ProtocolStream, MessageType } = require('@thermocline-labs/pod-protocol-stream')
const SerialPort = require('serialport')

const stream = new ProtocolStream()
const port = new SerialPort('/dev/tty.usbserial', {
  baudRate: 115200
})

stream.pipe(port).pipe(stream)
stream.on('response', response => console.log(response))
stream.request({ type: MessageType.READ_ALL })
```
