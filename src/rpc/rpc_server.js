const amqp = require('amqplib/callback_api')
const { fibonacci } = require('./aux_function/fibonacci')

amqp.connect('amqp://localhost', (err, conn) => {
  if (err) throw err

  conn.createChannel((err, channel) => {
    if (err) throw err

    const queue = 'rpc_queue'

    channel.assertQueue(queue, { durable: false })
    channel.prefetch(1)
    console.log(' [x] Awaiting RPC requests')
    channel.consume(queue, function reply(message) {
      const number = parseInt(message.content.toString())

      console.log(` [.] fib${number}`)

      const result = fibonacci(number)

      channel.sendToQueue(message.properties.replyTo,
        Buffer.from(result.toString()), {
          correlationId: message.properties.correlationId
        }
      )

      channel.ack(message)
    })
  })
})
