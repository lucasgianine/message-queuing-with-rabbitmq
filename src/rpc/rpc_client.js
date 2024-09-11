const amqp = require('amqplib/callback_api')
const { generateUuid } = require('./aux_function/generate_uuid')

const args = process.argv.slice(2)

if (args.length === 0) {
  console.log('Usage: npm run client <number>')
  process.exit(1)
}

amqp.connect('amqp://localhost', (err, conn) => {
  if (err) throw err

  conn.createChannel((err, channel) => {
    if (err) throw err

    channel.assertQueue('', { exclusive: true }, (err, q) => {
      if (err) throw err

      const correlationId = generateUuid()
      const number = parseInt(args[0])

      console.log(` [x] Requesting fib(${number})`)

      channel.consume(q.queue, (message) => {
        if (message.properties.correlationId === correlationId) {
          console.log(` [.] Got ${message.content.toString()}`)
          setTimeout(() => {
            conn.close()
            process.exit(0)
          }, 500)
        }
      }, { noAck: true })

      channel.sendToQueue('rpc_queue',
        Buffer.from(number.toString()), {
          correlationId,
          replyTo: q.queue
        }
      )
    })
  })
})
