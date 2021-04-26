const test = require('tape')
const { ProtocolStream, MessageType } = require('.')

test('request read all', t => {
  t.plan(5)

  const protocol = new ProtocolStream()

  protocol.on('data', buffer => {
    t.deepEqual(buffer, Buffer.of(1))

    const data = Buffer.alloc(13)
    data[0] = MessageType.READ_ALL
    data.writeFloatBE(25.5, 1)
    data.writeFloatBE(35.5, 5)
    data.writeFloatBE(45.5, 9)
    protocol.write(data)
  })

  protocol.on('response', response => {
    t.equal(response.type, 1)
    t.equal(response.overflowTankTemperature, 25.5)
    t.equal(response.environmentTemperature, 35.5)
    t.equal(response.environmentHumidity, 45.5)
  })

  protocol.request({ type: MessageType.READ_ALL })
})
