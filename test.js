const test = require('tape')
const { ProtocolStream, MessageType } = require('.')

test('request read all', t => {
  t.plan(3)

  const protocol = new ProtocolStream()

  protocol.on('data', buffer => {
    t.deepEqual(buffer, Buffer.of(1))

    const data = Buffer.alloc(5)
    data[0] = MessageType.READ_ALL
    data.writeFloatBE(25.5, 1)
    protocol.write(data)
  })

  protocol.on('response', response => {
    t.equal(response.type, 1)
    t.equal(response.temperature, 25.5)
  })

  protocol.request({ type: MessageType.READ_ALL })
})
