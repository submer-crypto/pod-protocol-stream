const { Duplex } = require('stream')

const MessageType = {
  READ_ALL: 1
}

const requestLength = function (type) {
  switch (type) {
    case MessageType.READ_ALL:
      return 1
  }
}

const responseLength = function (type) {
  switch (type) {
    case MessageType.READ_ALL:
      return 5
  }
}

class ProtocolStream extends Duplex {
  constructor (options) {
    super(options)

    this._buffer = Buffer.alloc(0)
    this._length = 0
    this._cb = null

    const receive = (length, cb) => {
      this._length = length
      this._cb = cb
    }

    const receiveHead = (buffer) => {
      const type = buffer[0]
      const length = responseLength(type)

      // The first byte has already been received
      if (length != null) receive(length - 1, receiveBody.bind(null, type))
      else receive(1, receiveHead)
    }

    const receiveBody = (type, buffer) => {
      const response = { type }

      switch (type) {
        case MessageType.READ_ALL:
          response.temperature = buffer.readFloatBE(0)
          break
      }

      this.emit('response', response)
      receive(1, receiveHead)
    }

    receive(1, receiveHead)
  }

  request (message) {
    const length = requestLength(message.type)
    const request = Buffer.allocUnsafe(length)
    request[0] = message.type
    this.push(request)
  }

  _read (n) {}

  _write (data, encoding, cb) {
    let buffer = Buffer.concat([this._buffer, data])

    while (buffer.length >= this._length) {
      const receiveBuffer = buffer.slice(0, this._length)
      buffer = buffer.slice(this._length)
      this._cb(receiveBuffer)
    }

    this._buffer = buffer
    cb()
  }
}

exports.MessageType = MessageType
exports.ProtocolStream = ProtocolStream
